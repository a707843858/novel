// import CustomComponent from './CustomComponent';

// type Constructor = new (...args: any[]) => void;

const componentMap: { [k: string]: any } = {};

export interface Options extends ElementDefinitionOptions {
  name: string;
  mode?: 'close' | 'open';
  style?: any;
}

export function define(options: any, elCtor: CustomElementConstructor) {
  let name = options.name || '';
  if (!name || customElements.get(name) || componentMap[name]) {
    return;
  }
  // console.log(Object.keys(elCtor.prototype));

  // console.log(elCtor.prototype);
  elCtor.prototype.cssStyle = options?.style?.toString() || '';
  elCtor.prototype.shadowMode = options?.mode || 'open';
  componentMap[name] = customElements.define(name, elCtor);

  // class CustomEle extends CustomComponent {
  //   cssStyle = options?.style?.toString() || '';
  //   shadowMode = options?.mode || undefined;
  // }

  // Object.getOwnPropertyNames(elCtor.prototype).map((key) => {
  //   if (key !== 'constructor') {
  //     if (typeof elCtor.prototype[key] === 'function') {
  //       CustomEle.prototype[key] = function () {
  //         return elCtor.prototype[key].apply(elCtor);
  //       };
  //     } else {
  //       CustomEle.prototype[key] = elCtor.prototype[key];
  //     }
  //   }
  // });

  // console.log(Object.getOwnPropertyNames(elCtor.prototype), 'elCtor');
  // console.log(Object.getOwnPropertyNames(elCtor.prototype),'aa');
  // if (!isHas) {
  //   Object.getOwnPropertyNames(elCtor.prototype).map((key) => {
  //     if (key !== 'constructor') {
  //       console.log(key, 'key');
  //       if (typeof elCtor.prototype[key] === 'function') {
  //         CustomComponent.prototype[key] = elCtor.prototype[key];
  //       } else {
  //         console.log(key,'key');
  //         Object.defineProperty(CustomComponent.prototype, key, {
  //           enumerable: true,
  //           get() {
  //             console.log('aaaannnnn',key, elCtor.prototype[key]);
  //             return elCtor.prototype[key];
  //           },
  //           set(val) {
  //             elCtor.prototype[key] = val;
  //           },
  //         });
  //       }
  //     }
  //   });
  //   CustomComponent.constructor = elCtor.constructor;
  //   customElements.define(name, CustomComponent);
  // }
}

export const defineComponent = function (
  elCtor: CustomElementConstructor,
  options: Options,
) {
  options.mode = options.mode || 'open';

  //
  if (
    !options.name ||
    customElements.get(options.name) ||
    componentMap[options.name]
  ) {
    return;
  }

  elCtor.prototype.cssStyle = options?.style?.toString() || '';
  elCtor.prototype.shadowMode = options?.mode;
  // console.log( elCtor.prototype.props);
  customElements.define(options.name, elCtor);
  componentMap[options.name] = elCtor;
};

export default { define, defineComponent };
