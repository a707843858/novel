import VNode from '@/core/VNode';
import 'reflect-metadata';
import { Reactive } from '@/core/reactiveData';
import { pushComponentQueue } from '@/core/taskQueue';

let componentUid: number = 1;

export interface NovelElementOptions {
  name: string;
  mode: 'closed' | 'open';
  style?: string;
}

export class NovelElement extends HTMLElement {
  readonly uid: number = componentUid++;
  //@ts-ignore
  readonly $isNovel: boolean = true;
  readonly $componentName: string = '';
  $self: NovelElement;
  $vnode?: VNode | null;
  $props: { [k: string]: any } = {};
  $states: { [k: string]: any } = {};
  $children?: any;
  $cssStyle?: string /** Only CSS text is supported */;
  $container: ShadowRoot;
  _isUpdate: boolean = false;
  _isInstalled: boolean = false;
  subChild: any;

  constructor(
    self: any,
    options: NovelElementOptions = { mode: 'closed', name: '' },
  ) {
    super();
    this.$self = self;
    this.$container = this.attachShadow({ mode: options.mode });
    //@ts-ignore
    this.$container.target = this;
    this.$cssStyle = options.style;
    this.$componentName = options.name;
    this.propNames = Reflect.getMetadata('propNames', this) || [];
    this.stateNames = Reflect.getMetadata('stateNames', this) || [];
  }
  private readonly propNames: string[] = [];
  private readonly stateNames: string[] = [];

  _children: any;

  /** Getter | Setter  */
  get isInstalled() {
    return this._isInstalled;
  }

  set isInstalled(val) {
    console.error(
      `It is forbidden to change the value of isInstalled, but now you set it to ${val}`,
    );
  }

  get isUpdate() {
    return this._isUpdate;
  }

  set isUpdate(val) {
    console.error(
      `It is forbidden to change the value of isUpdate, but now you set it to ${val}`,
    );
  }

  set children(val: any) {
    const { _isInstalled, $children } = this;
    if (_isInstalled && $children) {
      $children.value = this.formatChildren(val);
    } else {
      this.$children = this.formatChildren(val);
    }
  }

  /** When the component is added to a document */
  async connectedCallback() {
    this.dataInitialization();
    this.beforeCreate && this.beforeCreate();
    this.createComponent();
    this.created && this.created();
  }

  createComponent() {
    this.$vnode = this.render() || null;
    const { $container, $vnode, $self } = this;
    console.log($vnode, '$vnode');
    pushComponentQueue(this, $container, undefined, $vnode, () => {
      this._isInstalled = true;
    });
  }

  updateComponent() {
    const { _isUpdate, _isInstalled, $vnode, $container, $self } = this;
    if (_isUpdate || !_isInstalled) {
      return false;
    }
    this._isUpdate = true;
    const $newVnode: any = this.render() || null;
    pushComponentQueue(this, $container, $vnode, $newVnode, () => {
      /** Delete the entire shadowRoot after the child element is deleted */
      if (!$newVnode) {
        this.parentNode?.removeChild(this);
      } else {
        this._isUpdate = false;
      }
    });
  }

  /** Data initialization before component creation  */
  dataInitialization() {
    this.definedProp();
    this.definedState();
    this.updateCss();
  }

  definedProp() {
    const { propNames } = this;
    if (!propNames?.length) {
      return;
    }

    propNames.forEach((item) => {
      const { $self } = this;
      let val = super.getAttribute(item);
      //TODO:需补全attribute类型触发事件
      item = item === 'children' ? '$children' : item;
      //@ts-ignore
      let origin = val || this[item] || $self[item]; //val !== '' ?  : true;
      this.$props[item] = origin;
      //@ts-ignore
      this[item] = new Reactive(origin, () => this.updateComponent());
    });
  }

  formatChildren(
    child: any[] | { [k: string]: any } | null | undefined | string,
  ): VNode[] | undefined {
    if (child) {
      child = Array.isArray(child) ? child : [child];
      child = child.map((current: any) => {
        if (typeof current === 'object') {
          let children = current.children || current.props?.children || '';
          return new VNode({
            type: current.type,
            props: current.props,
            children: children ? this.formatChildren(children) : undefined,
          });
        } else {
          return new VNode({ type: 'TEXT', props: { nodeValue: current } });
        }
      });
    } else {
      return undefined;
    }
  }

  definedState() {
    const states: string[] = Reflect.getMetadata('stateNames', this) || [];
    states.forEach((state) => {
      //@ts-ignore
      let origin = this[state];
      this.$states[state] = origin;
      //@ts-ignore
      this[state] = new Reactive(origin, () => this.updateComponent());
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

  updateCss() {
    const { $cssStyle, $container } = this;
    if ($cssStyle) {
      let css = $cssStyle.replace(/(\/\/.*$)|(\/\*(.|\s)*?\*\/)/g, '');
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(css);
      $container && ($container.adoptedStyleSheets = [styleSheet]);
    }
  }

  setAttribute(key: string, value: any) {
    const { _isInstalled, propNames } = this;
    if (propNames.includes(key)) {
      //@ts-ignore
      if (_isInstalled) {
        //@ts-ignore
        this[key]['value'] = value;
      } else {
        //@ts-ignore
        this[key] = value;
      }
    } else {
      super.setAttribute(key, value);
    }
    //@ts-ignore
  }

  removeAttribute(key: string) {
    const propNames: string[] = Reflect.getMetadata('propNames', this) || [];
    if (propNames.includes(key)) {
      //@ts-ignore
      this[key]['value'] = undefined;
    } else {
      super.removeAttribute(key);
    }
  }

  /** subClass Methods */
  beforeCreate() {}
  created() {}
  render(): VNode | null | undefined {
    return null;
  }
}

export default NovelElement;
