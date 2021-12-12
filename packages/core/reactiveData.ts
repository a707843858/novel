type ReactiveDataTypes = 'simple' | 'reference';

export class Reactive<T extends any> {
  private _value: T;
  readonly type: ReactiveDataTypes;
  updateFn: Function;

  constructor(data: T, updateFn: Function) {
    if (data instanceof Reactive) {
      throw Error('Do not generate reactive data repeatedly !');
    }
    //@ts-ignore
    this._value =
      typeof data === 'object'
        ? //@ts-ignore
          new Proxy(data, {
            set: function (target, key) {
              console.log('a', '设置');
            },
          })
        : data;
    this.type = typeof data === 'object' ? 'reference' : 'simple';
    this.updateFn = updateFn;
    // this._dep = new Dep();
  }

  get value() {
    return this._value;
  }

  set value(val: T) {
    console.log(val, 'value');
    // trigger(this,'value');
    // debugger;/
    const { _value } = this;
    if (!Object.is(val, _value)) {
      console.log('出发了', val);
      this._value = val;
      this.updateFn();
    }
  }
}

export function definedReactive<T extends any>(data: T, updateFn: Function) {
  let value = data;
  let proxyOrigin: { [k: string]: any } = { value: value };
  let proxyData = new Proxy(proxyOrigin, {
    get(target: { [k: string]: any }, key: string, receiver: any) {
      return Reflect.get(target, key, receiver);
    },
    set(target: { [k: string]: any }, key: string, val: any, receiver: any) {
      console.log('改变了', key);
      target[key] = val;
      updateFn();
      return Reflect.set(target, key, val, receiver);
    },
  });
  return proxyData;
}
// let depIndex = 0;
// export class Dep {
//   static target?: Dep;
//   id: number = ++depIndex;
//   deps: Watcher[] = [];
//
//   addWatcher(watcher: Watcher) {
//     this.deps.push(watcher);
//   }
//
//   removeWatcher(dep: Watcher) {}
//
//   depend() {
//     // @ts-ignore
//     Dep.target?.addWatcher(this);
//   }
//
//   notify() {
//     this.deps.forEach((watcher) => watcher.update());
//   }
// }
//
// let watcherIndex = 0;
// export class Watcher {
//   id: number = ++watcherIndex;
//   ex;
//   updateFunction;
//   callback;
//   options;
//   deps: any[] = [];
//   depsId: Set<string | number> = new Set();
//
//   constructor(
//     ex: any,
//     updateFunction: Function,
//     callback?: Function,
//     options?: any,
//   ) {
//     this.ex = ex;
//     this.updateFunction = updateFunction;
//     this.callback = callback;
//     this.options = options;
//     this.get();
//   }
//
//   get() {
//     if(Dep){
//       Dep.target = this;
//       this.updateFunction();
//       Dep.target = null;
//     }
//   }
//
//   addDep(dep: Dep) {
//     let id = dep.id;
//     if (!this.depsId.has(id)) {
//       this.deps.push(dep);
//       this.depsId.add(id);
//       dep.addWatcher(this);
//     }
//   }
//
//   update() {
//     console.log('通知更新了');
//   }
// }
//
//
// //依赖收集
// const targetMap:WeakMap<object,Map<any,any>> = new WeakMap();
// let activeEffect:any;
// function track(target: Reactive<any>, key: any) {
//   let depMap = targetMap.get(target);
//   if (!depMap) {
//     targetMap.set(target, (depMap = new Map()));
//   }
//   let deps = depMap.get(key);
//   if (activeEffect) {
//     deps.add(activeEffect);
//     activeEffect.deps.push(deps);
//   }
// }
//
// function trigger(target: Reactive<any>, key:any) {
//   const depMap = targetMap.get(target);
//   if (!depMap) return;
//   const deps = depMap.get(key);
//   console.log(deps,'deps');
//   deps.forEach((dep:any) => {
//     dep();
//   });
// }
//
// function effect(fn:Function) {
//   const effect1 = createReactiveEffect(fn);
//   effect1();
// }
//
// function createReactiveEffect(fn:Function) {
//   const effect:any = function reactiveEffect() {
//     activeEffect = effect;
//     return fn();
//   };
//   effect.deps = [];
//   return effect;
// }
//
// //任务队列
// const queue:Watcher[] = [];
// let has:{[k:number]:boolean} = {},
//   waiting:boolean = false,
//   flushing:boolean = false;
//
// export  function  queueWatchers(watcher:Watcher){
//   const id = watcher.id;
//
//   //判断是否加入队列
//   if(has[id] == null){
//
//     has[id] = true;
//     //还未更新
//     if(!flushing){
//       queue.push(watcher);
//     }else{
//
//     }
//   }
// }
//
