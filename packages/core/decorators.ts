import 'reflect-metadata';
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
    const propNames = Reflect.getMetadata('propNames', target) || [
      // 'props',
      'subChild',
    ];
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
    } else if (!options.mode) {
      throw new Error('Component must have mode !');
    }

    return class extends target {
      constructor() {
        super(target, options);
      }
    };
  };
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
    const states = Reflect.getMetadata('stateNames', target) || [];
    states.push(key);
    Reflect.defineMetadata('stateNames', states, target);
  };
}
