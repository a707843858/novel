import { newRender } from '../newElement';
import 'reflect-metadata';
import { Reactive } from '../reactiveData';

export interface ComponentOptions extends ElementDefinitionOptions {
  name: string;
  mode?: 'closed' | 'open';
  style?: any;
}

export function makeProxy(origin: any) {
  let value =
    origin && origin instanceof Object
      ? { ...origin, _type: 'reference' }
      : { value: origin, _type: 'simple' };
  return new Proxy(value, {
    get(target: any, key: string) {
      console.log(key, 'Proxy 获取了');
      return target[key];
    },
    set(target: any, key: string, value: any) {
      console.log(key, 'Proxy 设置了');
      target[key] = value;
      return true;
    },
  });
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
    // Reflect.defineMetadata('shadowMode', options.mode, target.prototype);
    // Reflect.defineMetadata('cssStyle', options.style, target.prototype);
    // Reflect.defineMetadata('componentName', options.name, target.prototype);

    type ShadowMode = 'open' | 'closed';
    return class extends target {
      _shadowRoot: ShadowRoot;
      _installed: boolean = false;
      _cssStyle: string = options.style || '';
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
        // const watcher = new Watcher(this, this._create.bind(this));
        // console.log(watcher, 'watcher');
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
          // super.removeAttribute(item);

          let origin = val === undefined ? true : val || this[item];
          this[item] = new Reactive(origin, this._create.bind(this));
          // console.log(this[item], item, 'a');
        });
      }

      _createCss() {
        const { _cssStyle, _shadowRoot } = this;
        if (_cssStyle) {
          let css = _cssStyle.replace(/(\/\/.*$)|(\/\*(.|\s)*?\*\/)/g, '');
          const styleSheet = new CSSStyleSheet();
          styleSheet.replaceSync(css);
          // console.log(styleSheet);
          _shadowRoot.adoptedStyleSheets = [styleSheet];
        }
      }

      _createState() {
        const states: string[] = Reflect.getMetadata('states', this) || [];
        states.forEach((state) => {
          let origin = this[state];
          this[state] = new Reactive(origin, this._create.bind(this));
          this[
            `set${state
              .trim()
              .toLowerCase()
              .replace(state[0], state[0].toUpperCase())}`
          ] = function (
            curVal: any,
            callback: (curVal: any, oldValue: any) => any,
          ) {
            const oldValue = this[state]['value'];
            this[state]['value'] = curVal;
            callback(curVal, oldValue);
          };
        });
      }

      async _create() {
        const virtualElement: any = this.render() || null;
        console.log(this._virtalNode, virtualElement);
        await newRender(this._shadowRoot, this._virtalNode, virtualElement);
        this._virtalNode = virtualElement;
        this._installed = true;
      }

      setAttribute(key: string, value: any) {
        const propNames: string[] =
          Reflect.getMetadata('propNames', this) || [];
        if (propNames.includes(key)) {
          this[key]['value'] = value;
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
      set shadowRoot(val: any) {}
      get installed() {
        return this._installed;
      }
      set installed(val: boolean) {}
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
    console.log(key, 'key');
    const states = Reflect.getMetadata('states', target) || [];
    states.push(key);
    Reflect.defineMetadata('states', states, target);
    // if (!target.constructor.__decorators__) {
    //   target.constructor.__decorators__ = [];
    // }
    // target.constructor.__decorators__.push(key);
    // console.log(target.state,'vvv vvv');
    // Object.defineProperty(target, key, {
    //   get() {
    //     return target['state'][key];
    //   },
    //   set(val: any) {
    //     // console.log('cc');
    //     target['state'][key] = val;
    //   },
    // });
    // console.log(target,'a');
    // target.state[key] = "";
    /** stateNames */
    // const stateNames = Reflect.getMetadata('stateNames', target) || [];
    // stateNames.push(key);
    // Reflect.defineMetadata('stateNames', stateNames, target);
    // let OriginValue = target[key];
    // let value =
    //   OriginValue instanceof Object
    //     ? { ...OriginValue, _type: 'reference' }
    //     : { value: OriginValue, _type: 'simple' };
    // let proxyValue = new Proxy(value, {
    //   get(target: any, key: string) {
    //     console.log(key, 'Proxy 获取了');
    //     return target[key];
    //   },
    //   set(target: any, key: string, value: any) {
    //     console.log(key, 'Proxy 设置了');
    //     target[key] = value;
    //     return true;
    //   },
    // });
    // // let value = makeProxy(OriginValue);
    // // // target[key] = value;
    // // console.log(value,target,key,'key');
    // Object.defineProperty(target, key, {
    //   get() {
    //     // return value;
    //     if (value) {
    //       if (value._type === 'simple') {
    //         return proxyValue.value;
    //       } else {
    //         return proxyValue;
    //       }
    //     } else {
    //       return undefined;
    //     }
    //   },
    //   set(val: any) {
    //     console.log('aa', val, target.installed, OriginValue);
    //     // value = makeProxy(val);
    //     //  if (value) {
    //     //    if (value._type === 'simple') {
    //     //     proxyValue.value = val;
    //     //    }
    //     //   //  else {
    //     //   //   proxyValue = val;
    //     //   //  }
    //     //  }
    //   },
    // });
  };
}
