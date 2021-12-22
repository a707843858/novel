import VNode from '@/core/VNode';
import 'reflect-metadata';
import { Reactive } from '@/core/reactiveData';
import { pushComponentQueue } from '@/core/newElement';

let componentUid: number = 1;

export interface NovelElementOptions {
  name: string;
  mode: 'closed' | 'open';
  style?: string;
}

export class NovelElement extends HTMLElement {
  readonly uid: number = componentUid++;
  //@ts-ignore
  readonly _isNovel: boolean;
  readonly $self: NovelElement;
  readonly $componentName: string = '';
  $vnode?: VNode | null;
  $props: { [k: string]: any } = {};
  $states: { [k: string]: any } = {};
  $cssStyle?: string /** Only CSS text is supported */;

  constructor(
    self: any,
    options: NovelElementOptions = { mode: 'closed', name: '' },
  ) {
    super();
    this._isNovel = true;
    this.$self = self;
    this._shadowRoot = this.attachShadow({ mode: options.mode });
    this.$cssStyle = options.style;
    this.$componentName = options.name;
  }

  _isInstalled: boolean = false;

  /** Getter | Setter  */
  get isInstalled() {
    return this._isInstalled;
  }

  set isInstalled(val) {
    console.error(
      `It is forbidden to change the value of isInstalled, but now you set it to ${val}`,
    );
  }

  _isUpdate: boolean = false;

  get isUpdate() {
    return this._isUpdate;
  }

  set isUpdate(val) {
    console.error(
      `It is forbidden to change the value of isUpdate, but now you set it to ${val}`,
    );
  }

  _shadowRoot: ShadowRoot | null = null;

  get shadowRoot() {
    return this._shadowRoot;
  }

  set shadowRoot(val) {
    console.error(
      `It is forbidden to change the value of shadowRoot, but now you set it to ${val}`,
    );
  }

  /** When the component is added to a document */
  async connectedCallback() {
    this.dataInitialization();
    this.beforeCreate && this.beforeCreate();
    this.createComponent();
    this.created && this.created();
  }

  createComponent() {
    const { _shadowRoot, $vnode } = this;
    pushComponentQueue(_shadowRoot, undefined, $vnode, () => {
      this._isInstalled = true;
    });
  }

  updateComponent() {
    const { _isUpdate, _isInstalled, $vnode, _shadowRoot } = this;
    if (_isUpdate || !_isInstalled) {
      return false;
    }
    this._isUpdate = true;
    const $newVnode: any = this.render() || null;
    pushComponentQueue(_shadowRoot, $vnode, $newVnode, () => {
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
    this.$vnode = this.render() || null;
  }

  definedProp() {
    const _propNames: string[] = Reflect.getMetadata('propNames', this) || [];
    if (!_propNames || !_propNames.length) {
      return;
    }

    _propNames.forEach((item) => {
      let val = super.getAttribute(item);
      //@ts-ignore
      let origin = val || this.$self[item]; //val !== '' ?  : true;
      this.$props[item] = origin;
      //@ts-ignore
      this[item] = new Reactive(origin, () => this.updateComponent());
    });
  }

  definedState() {
    const states: string[] = Reflect.getMetadata('states', this) || [];
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
    const { $cssStyle, _shadowRoot } = this;
    if ($cssStyle) {
      let css = $cssStyle.replace(/(\/\/.*$)|(\/\*(.|\s)*?\*\/)/g, '');
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(css);
      _shadowRoot && (_shadowRoot.adoptedStyleSheets = [styleSheet]);
    }
  }

  setAttribute(key: string, value: any) {
    const propNames: string[] = Reflect.getMetadata('propNames', this) || [],
      { _isInstalled } = this;
    if (propNames.includes(key)) {
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
