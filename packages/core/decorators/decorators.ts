import CustomComponent from '../CustomComponent';
import { define, defineComponent } from '../define';
import { newRender } from '../newElement';
import 'reflect-metadata';

const componentMap: { [k: string]: any } = {};

export interface ComponentOptions extends ElementDefinitionOptions {
  name: string;
  mode?: 'closed' | 'open';
  style?: any;
}

export function Prop() {
  return (target: any, key: string) => {
    target.__proto__._bindProp(key, target[key]);
    const propsNames =
      Reflect.getMetadata('propsNames', target.__proto__) || [];
    propsNames.push(key);
    Reflect.defineMetadata('propsNames', propsNames, target.__proto__);
  };
}

type T = { [k: string]: any };
export function Component(options: ComponentOptions) {
  return (target: any): typeof target => {
    if (!options.name) {
      throw new Error('Component must have name !');
    }
    Reflect.defineMetadata(
      'shadowMode',
      options.mode,
      target.prototype.__proto__,
    );
    Reflect.defineMetadata(
      'cssStyle',
      options.style,
      target.prototype.__proto__,
    );
    Reflect.defineMetadata(
      'componentName',
      options.name,
      target.prototype.__proto__,
    );
  };
}

export function Watch(fnName: string, parameter?: any) {
  return (target: any, key: string) => {
    let value = target[key];
    Object.defineProperty(target, key, {
      get() {
        return value;
      },
      set(val: any) {
        // console.log(val,'vvvvvvvvv');
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
