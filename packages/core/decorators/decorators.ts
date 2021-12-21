import { pushComponentQueue } from '../newElement';
import 'reflect-metadata';
import { Reactive } from '../reactiveData';
import VNode from '@/core/VNode';

export interface ComponentOptions extends ElementDefinitionOptions {
  name: string;
  mode?: 'closed' | 'open';
  style?: any;
}

/**
 *
 * @param type
 * @returns
 */
export function Prop(type?: any | Function[]) {
  return (target: any, key: string) => {
    /** props */
    const props = Reflect.getMetadata('props', target) || {};
    props[key] = { type: Reflect.getMetadata('design:type', target, key) };
    Reflect.defineMetadata('props', props, target);

    /** propNames */
    const propNames = Reflect.getMetadata('propNames', target) || [];
    propNames.push(key);
    Reflect.defineMetadata('propNames', propNames, target);
  };
}

/**
 *
 * @param options
 * @returns
 */
export function Component(options: ComponentOptions) {
  return (target: any): typeof target => {
    if (!options.name) {
      throw new Error('Component must have tag name !');
    }

    type ShadowMode = 'open' | 'closed';
    return class extends target {
      _shadowRoot: ShadowRoot;
      _installed: boolean = false;
      _cssStyle: string = options.style || '';
      _virtualNode?: VNode;
      _willUpdate: boolean = false;
      readonly mode: ShadowMode = options.mode || 'closed';
      readonly isComponent: boolean = true;
      readonly componentName: string = options.name;

      constructor() {
        super();
        this._shadowRoot = this.attachShadow({
          mode: this.mode,
        });
      }

      async connectedCallback() {
        this._beforeCreate();
        this.beforeCreate && this.beforeCreate();
        await this._create();
        this.created && this.created();
      }

      _beforeCreate() {
        this._attrToProp();
        this._createState();
        this._createCss();
      }

      _attrToProp() {
        const _propNames: string[] =
          Reflect.getMetadata('propNames', this) || [];
        if (!_propNames || !_propNames.length) {
          return;
        }

        _propNames.forEach((item) => {
          let val = super.getAttribute(item);
          let origin = [undefined, ''].includes(val) ? true : val || this[item];
          this[item] = new Reactive(origin, () => this._update());
          // console.log(this[item], item, 'item');
        });
      }

      _createCss() {
        const { _cssStyle, _shadowRoot } = this;
        if (_cssStyle) {
          let css = _cssStyle.replace(/(\/\/.*$)|(\/\*(.|\s)*?\*\/)/g, '');
          const styleSheet = new CSSStyleSheet();
          styleSheet.replaceSync(css);
          _shadowRoot.adoptedStyleSheets = [styleSheet];
        }
      }

      disconnectedCallback() {
        console.log('移除了');
      }

      _createState() {
        const states: string[] = Reflect.getMetadata('states', this) || [];
        states.forEach((state) => {
          let origin = this[state];
          this[state] = new Reactive(origin, () => this._update());
          // this[
          //   `set${state
          //     .trim()
          //     .toLowerCase()
          //     .replace(state[0], state[0].toUpperCase())}`
          // ] = async function (
          //   curVal: any,
          //   callback: (curVal: any, oldValue: any) => any,
          // ) {
          //   const oldValue = this[state]['value'];
          //   this[state]['value'] = curVal;
          //   await  this._create();
          //   callback(curVal, oldValue);
          // };
        });
      }

      _create() {
        const virtualElement: any = this.render() || null;
        pushComponentQueue(
          this._shadowRoot,
          this._virtualNode,
          virtualElement,
          () => {
            if (!this._virtualNode) {
              this._virtualNode = virtualElement;
              this._installed = true;
            }
          },
        );
      }

      _update() {
        const that = this;
        if (this._willUpdate || !this._installed) {
          return false;
        }
        this._willUpdate = true;
        const virtualElement: any = this.render() || null;
        pushComponentQueue(
          this._shadowRoot,
          this._virtualNode,
          virtualElement,
          () => {
            that._willUpdate = false;
          },
        );
        // this._virtualNode = virtualElement;
      }

      setAttribute(key: string, value: any) {
        const propNames: string[] =
            Reflect.getMetadata('propNames', this) || [],
          { _installed } = this;
        if (propNames.includes(key)) {
          if (_installed) {
            this[key]['value'] = value;
          } else {
            this[key] = value;
          }
        } else {
          super.setAttribute(key, value);
        }
      }

      removeAttribute(key: string) {
        const propNames: string[] =
          Reflect.getMetadata('propNames', this) || [];
        if (propNames.includes(key)) {
          this[key]['value'] = null;
        } else {
          super.removeAttribute(key);
        }
      }

      //Getter,Setter
      get cssStyle() {
        return this._cssStyle;
      }
      set cssStyle(val: string) {}
      get shadowRoot() {
        return this._shadowRoot;
      }
      set shadowRoot(val: any) {
        throw new Error(`Can't set  shadowRoot `);
      }
      get installed() {
        return this._installed;
      }
      set installed(val: boolean) {
        throw new Error(`Can't set  installed `);
      }
    };
  };
  // return (target: any): typeof target => {
  //   if (!options.name) {
  //     throw new Error('Component must have name !');
  //   }
  //   Reflect.defineMetadata('shadowMode', options.mode, target.prototype);
  //   Reflect.defineMetadata('cssStyle', options.style, target.prototype);
  //   Reflect.defineMetadata('componentName', options.name, target.prototype);
  // };
}

/**
 *
 * @param fnName  The name of the callback function
 * @param parameter  Additional transmission parameters
 * @returns
 */
export function Watch(fnName: string, parameter?: any) {
  return (target: any, key: string) => {
    let value = target[key];
    Object.defineProperty(target, key, {
      get() {
        return value;
      },
      set(val: any) {
        const old = value;
        value = val;
        const item = target[fnName] || '';
        if (!item || typeof item !== 'function' || old === value) {
          return false;
        } else {
          target[fnName](value, old, parameter);
        }
      },
    });
  };
}

export function State() {
  return (target: any, key: string) => {
    const states = Reflect.getMetadata('states', target) || [];
    states.push(key);
    Reflect.defineMetadata('states', states, target);
  };
}
