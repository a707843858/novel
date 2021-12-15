import VNode from './VNode';
import { Watch } from './decorators/decorators';
import 'reflect-metadata';
// import { reactiveData } from './reactiveData';

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
      console.log('Proxy 设置了');
      return true;
    },
  });
}

export class CustomComponent extends HTMLElement {
  [k: string]: any;
  @Watch('_bindCss')
  _state: { [k: string]: any } = {};
  cssStyle: string | null = '';
  readonly _isComponent: boolean = true;
  _propNames: string[] = [] /** propsName集合 */;
  _shadowRoot?: ShadowRoot /**挂载点 */;
  _virtalNode: null | VNode = null /** 虚拟dom */;
  _shadowMode: ShadowMode = 'open'; //影子模式
  _installed: boolean = false /** 是否已经安装完成 */;
  _componentName: string = '' /** 组件名称 */;

  constructor(elConstructor: T) {
    super();
    /** 初始化State */
    const _state: { [k: string]: any } = {};
    this._state = {};
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
  set propNames(val: any) {
    val;
  }
  get propNames() {
    return this._propNames;
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
  set state(val: any) {
    val;
  }
  get state() {
    return this._state;
  }

  /** 设置Prop */
  // setAttribute<U extends keyof T & string>(key: U, value: any) {
  //   const propNames = this._propNames;
  //   if (propNames.includes(key)) {
  //     this[key] = value;
  //   } else {
  //     super.setAttribute(key, value);
  //   }
  // }

  /** 获取Prop */
  // getAttribute<U extends keyof T & string>(key: U): any {
  //   const propNames = this._propNames;
  //   if (propNames.includes(key)) {
  //     return this[key] || '';
  //   } else {
  //     return super.getAttribute(key);
  //   }
  // }

  /** 删除Prop */
  // removeAttribute<U extends keyof T & string>(key: U) {
  //   let proxyValue = makeProxy(null);
  //   Object.defineProperty(this, key, {
  //     get() {
  //       // console.log('获取');
  //       if (proxyValue) {
  //         if (proxyValue._type === 'simple') {
  //           return proxyValue.value;
  //         } else {
  //           return proxyValue;
  //         }
  //       } else {
  //         return undefined;
  //       }
  //       // return proxyValue;
  //     },
  //     set(val: any) {
  //       proxyValue = makeProxy(val);
  //       // console.log(val, this._installed, 'Obejct监听');
  //       if (this._installed) {
  //         this.create();
  //       }
  //     },
  //   });
  // }

  /** 绑定Prop */
  // _bindProp(key: string, value: any) {
  //   let proxyValue = makeProxy(value);
  //   Object.defineProperty(this, key, {
  //     get() {
  //       // console.log('获取');
  //       if (proxyValue) {
  //         if (proxyValue._type === 'simple') {
  //           return proxyValue.value;
  //         } else {
  //           return proxyValue;
  //         }
  //       } else {
  //         return undefined;
  //       }
  //       // return proxyValue;
  //     },
  //     set(val: any) {
  //       proxyValue = makeProxy(val);
  //       // console.log(val, this._installed, 'Obejct监听');
  //       if (this._installed) {
  //         this.create();
  //       }
  //     },
  //   });
  //   // console.log(this, 'v');

  //   // this.props[key] = '';
  //   // let value = this[prop];
  //   // Object.defineProperty(this, prop, {
  //   //   get() {
  //   //     return value;
  //   //   },
  //   //   set(val: any) {
  //   //     const old = value;
  //   //     value = val;
  //   //     if (this.installed) {
  //   //       this.create();
  //   //     }
  //   //   },
  //   // });
  // }

  /** 初次创建组件 */
  // connectedCallback() {
  //   this._beforeCreated();
  //   this.beforeCreate();
  //   this.create();
  //   this.created();
  // }

  /** 创建之前准备工作 */
  // _beforeCreated() {
  //   //初次渲染
  //   this._propNames = Reflect.getMetadata('propNames', this) || [];
  //   this._shadowMode = Reflect.getMetadata('shadowMode', this) || 'open';
  //   this.cssStyle = Reflect.getMetadata('cssStyle', this) || '';
  //   this._componentName = Reflect.getMetadata('componentName', this) || '';
  //   this._shadowRoot = this.attachShadow({
  //     mode: this._shadowMode,
  //   });
  //   this._attrToProp();
  //   // this._createState();
  //   this._createCss();
  // }

  /** 属性转换成Prop */
  // _attrToProp() {
  //   const { _propNames } = this;
  //   if (!_propNames || !_propNames.length) {
  //     return;
  //   }

  //   _propNames.forEach((item) => {
  //     let val = super.getAttribute(item);
  //     if (val !== null) {
  //       super.removeAttribute(item);
  //       const orign = val === undefined ? true : val;
  //       this[item] = new reactiveData(orign);

  //       // let proxyValue = makeProxy(val);
  //       // Object.defineProperty(this, item, {
  //       //   get() {
  //       //     // console.log('获取');
  //       //     if (proxyValue) {
  //       //       if (proxyValue._type === 'simple') {
  //       //         return proxyValue.value;
  //       //       } else {
  //       //         return proxyValue;
  //       //       }
  //       //     } else {
  //       //       return undefined;
  //       //     }
  //       //     // return proxyValue;
  //       //   },
  //       //   set(val: any) {
  //       //     proxyValue = makeProxy(val);
  //       //     // console.log(val, this._installed, 'Obejct监听');
  //       //     if (this._installed) {
  //       //       this.create();
  //       //     }
  //       //   },
  //       // });
  //       // this[item] = val;
  //     }
  //   });
  // }

  /** 创建State */
  _createState() {
    const _state: { [k: string]: any } = {};
    const that = this;
    this._state = new Proxy(_state, {
      get(target: any, key: string) {
        return target[key];
      },
      set(target: any, key: string, value: any) {
        console.log('改变了', value);
        if (target[key] !== value) {
          target[key] = value;
          that.create();
        }
        return true;
      },
    });
    // const stateProps: string[] = Reflect.getMetadata('stateNames', this) || [];
    // stateProps.forEach(item => {
    //   this._state[item] = undefined;
    // });
  }

  /** 添加css */
  // _createCss() {
  //   const { cssStyle, _shadowRoot } = this;
  //   if (cssStyle) {
  //     let css = cssStyle.replace(/(\/\/.*$)|(\/\*(.|\s)*?\*\/)/g, '');
  //     const styleSheet = new CSSStyleSheet();
  //     styleSheet.replaceSync(css);
  //     // console.log(styleSheet);
  //     _shadowRoot &&
  //       _shadowRoot instanceof ShadowRoot &&
  //       (_shadowRoot.adoptedStyleSheets = [styleSheet]);
  //   }
  // }

  /** 创建 */
  // async create() {
  //   //@ts-ignore
  //   // console.log(this.constructor.__decorators__, '__decorators__tt');
  //   const virtalElement: any = this.render() || null;
  //   // console.log(this._virtalNode,virtalElement);
  //   await newRender(this._shadowRoot, this._virtalNode, virtalElement);
  //   // const style = document.createElement('style');
  //   // style.innerHTML = this.cssStyle || '';
  //   // this._shadowRoot?.appendChild(style);
  //   this._virtalNode = virtalElement;
  //   this._installed = true;
  // }

  /** 设置cssStyle */
  // _bindCss(cur?: string | null) {
  //   if (cur && this._shadowRoot) {
  //     let css = cur.replace(/(\/\/.*$)|(\/\*(.|\s)*?\*\/)/g, '');
  //     const styleSheet = new CSSStyleSheet();
  //     styleSheet.replaceSync(css);
  //     this._shadowRoot.adoptedStyleSheets = [styleSheet];
  //   }
  // }

  /** 子类的方法 */
  render(): NodeTree | null | string | undefined {
    return '';
  }
  beforeCreate() {}
  created() {}
}

export default CustomComponent;
