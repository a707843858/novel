// import {
//   VNodeTag,
//   VNodeAttributes,
//   VNodeKey,
//   VNodeChildren,
//   VNodeElement,
//   render,
//   Fiber,
//   IncrementalRender,
//   // newRender,
// } from './element';
import VNode from './VNode';
import { newRender } from './newElement';
import { readonly } from './decorators/utils';
import { Watch } from './decorators/decorators';
import 'reflect-metadata';

interface vNodeType {
  tag?: any;
  attributes?: Map<any, any>;
  children?: string | any[];
}

interface NodeTree {
  node?: HTMLElement;
  vNode?: vNodeType;
}

interface ComponentProps {
  [k: string]: any;
}

type T = { [k: string]: any };
type ShadowMode = 'open' | 'closed';

function makeProxy(orign: any) {
  let value =
    orign && orign instanceof Object
      ? { ...orign, _type: 'reference' }
      : { value: orign, _type: 'simple' };
  return new Proxy(value, {
    get(target: any, key: string) {
      return target[key];
    },
    set(target: any, key: string, value: any) {
      target[key] = value;
      // console.log('Proxy 设置了');
      return true;
    },
  });
}

export class CustomComponent extends HTMLElement {
  [k: string]: any;
  @Watch('_bindCss')
  cssStyle: string | null = '';
  readonly _isComponent: boolean = true;
  _propsNames: string[] = [] /** propsName集合 */;
  _shadowRoot?: ShadowRoot /**挂载点 */;
  _virtalNode: null | VNode = null /** 虚拟dom */;
  _shadowMode: ShadowMode = 'open'; //影子模式
  _installed: boolean = false /** 是否已经安装完成 */;
  _componentName: string = '' /** 组件名称 */;

  constructor() {
    super();
    // console.log(this._propsNames, '_propsNames');
  }

  set installed(val: boolean) {
    val;
  }
  get installed() {
    return this._installed;
  }
  set virtalNode(val: any) {
    val;
  }
  get virtalNode() {
    return this._virtalNode;
  }
  set isComponent(val: any) {
    val;
  }
  get isComponent() {
    return this._isComponent;
  }
  set shadowRoot(val: any) {
    val;
  }
  get shadowRoot() {
    return this._shadowRoot;
  }
  set propsNames(val: any) {
    val;
  }
  get propsNames() {
    return this._propsNames;
  }
  set shadowMode(val: ShadowMode) {
    if (this._installed) {
      this._shadowMode = val;
    }
  }
  get shadowMode() {
    return this._shadowMode;
  }
  set componentName(val: any) {
    if (!this._installed) {
      this._componentName = val;
    }

  }
  get componentName() {
    return this._componentName;
  }

  /** 设置Prop */
  setAttribute<U extends keyof T & string>(key: U, value: any) {
    const propsNames = this._propsNames;
    if (propsNames.includes(key)) {
      this[key] = value;
    } else {
      super.setAttribute(key, value);
    }
  }

  /** 获取Prop */
  getAttribute<U extends keyof T & string>(key: U): any {
    const propsNames = this._propsNames;
    if (propsNames.includes(key)) {
      return this[key] || ''
    } else {
      return super.getAttribute(key);
    }

  }

  /** 删除Prop */
  removeAttribute<U extends keyof T & string>(key: U) {
    let proxyValue = makeProxy(null);
    Object.defineProperty(this, key, {
      get() {
        // console.log('获取');
        if (proxyValue) {
          if (proxyValue._type === 'simple') {
            return proxyValue.value;
          } else {
            return proxyValue;
          }
        } else {
          return undefined;
        }
        // return proxyValue;
      },
      set(val: any) {
        proxyValue = makeProxy(val);
        console.log(val, this._installed, 'Obejct监听');
        if (this._installed) {
          this._create();
        }
      },
    });
  }

  /** 绑定Prop */
  _bindProp(key: string, value: any) {
    let proxyValue = makeProxy(value);
    Object.defineProperty(this, key, {
      get() {
        // console.log('获取');
        if (proxyValue) {
          if (proxyValue._type === 'simple') {
            return proxyValue.value;
          } else {
            return proxyValue;
          }
        } else {
          return undefined;
        }
        // return proxyValue;
      },
      set(val: any) {
        proxyValue = makeProxy(val);
        // console.log(val, this._installed, 'Obejct监听');
        if (this._installed) {
          this._create();
        }
      },
    });
    // console.log(this, 'v');

    // this.props[key] = '';
    // let value = this[prop];
    // Object.defineProperty(this, prop, {
    //   get() {
    //     return value;
    //   },
    //   set(val: any) {
    //     const old = value;
    //     value = val;
    //     if (this.installed) {
    //       this._create();
    //     }
    //   },
    // });
  }

  /** 初次创建组件 */
  connectedCallback() {
    //初次渲染
    this._propsNames = Reflect.getMetadata('propsNames',this) || [];
    this._shadowMode = Reflect.getMetadata('shadowMode', this) || 'open';
    this.cssStyle = Reflect.getMetadata('cssStyle', this) || '';
    this._componentName = Reflect.getMetadata('componentName', this) || '';;
    this._shadowRoot = this.attachShadow({
      mode: this._shadowMode,
    });
    this._beforeCreated();
    this.beforeCreate();
    this._create();
    this.created();
  }

  /** 创建之前 */
  _beforeCreated<U extends keyof T & string>() {
    const { cssStyle, _shadowRoot } = this;
    //----- cssStyle -----
    this._attrToProp();
    if (cssStyle) {
      let css = cssStyle.replace(/(\/\/.*$)|(\/\*(.|\s)*?\*\/)/g, '');
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(css);
      _shadowRoot &&
        _shadowRoot instanceof ShadowRoot &&
        (_shadowRoot.adoptedStyleSheets = [styleSheet]);
    }
  }

  /** 属性转换成Prop */
  _attrToProp() {
    const { _propsNames } = this;
    if (!_propsNames || !_propsNames.length) {
      return;
    }

    _propsNames.forEach(item => {
      console.log(item, 'key');
      const val = super.getAttribute(item);
      if (val !== null) {
        this[item] = val;
      }
    });

  }

  /** 创建 */
  async _create() {
    const virtalElement: any = this.render() || null;
    await newRender(this._shadowRoot, this._virtalNode, virtalElement);
    this._virtalNode = virtalElement;
    this._installed = true;
  }

  /** 设置cssStyle */
  _bindCss(cur?: string | null) {
    if (cur && this._shadowRoot) {
      let css = cur.replace(/(\/\/.*$)|(\/\*(.|\s)*?\*\/)/g, '');
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(css);
      this._shadowRoot.adoptedStyleSheets = [styleSheet];
    }
  }

  /** 子类的方法 */
  render(): NodeTree | null | string | undefined {
    return '';
  }
  beforeCreate() {}
  created() {}
}

export default CustomComponent;
