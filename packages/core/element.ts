import VNode from './VNode';
import { componentNames } from './register';

/** 判断节点是否可以复用 */
export function isSameNode(old?: VNode, newV?: VNode) {
  if (!old || !newV) {
    return false;
  }

  return (
    (old.key && newV.key && old.key === newV.key) ||
    (old.type === newV.type && old.props && newV.props)
  );
}

/** 为旧节创建映射 */
export function creatNodeMap(
  list: VNode[],
  start: number,
  end: number,
): { [k: string]: VNode } {
  const map: { [k: string]: any } = {};
  for (let i = start; i < end; i++) {
    const key = list[i].key;
    if (key) {
      map[key] = list[i];
    }
  }
  return map;
}

/** 在节点组中寻找相似的 */
export function findNode(
  node: VNode,
  list: VNode[],
  start: number,
  end: number,
): VNode | undefined {
  for (let i = start; i < end; i++) {
    const item = list[i];
    if (node && isSameNode(node, item)) {
      return item;
    }
  }
}

export const createVirtualElement = function (
  type: any,
  props: { [k: string]: any },
  ...children: Array<any>
) {
  let textString = '';
  const vChildren: VNode[] = [];

  for (let i = 0; i < children.length; i++) {
    let child = children[i];

    /** 处理数组类型 */
    while (Array.isArray(child)) {
      children.splice(i, 1, ...child);
      child = children[i];
    }

    if (typeof child === 'object') {
      if (textString) {
        vChildren.push(
          new VNode({ type: 'TEXT', props: { nodeValue: textString } }),
        );
        textString = '';
      }
      vChildren.push(child);
    } else if (typeof child === 'string' || typeof child === 'number') {
      textString += ` ${child}`;
    }
  }
  // children.map((child) => {
  //   let virtualChild = child;
  //   if (typeof virtualChild === 'object') {
  //     if (textString) {
  //       vChildren.push(
  //         new VNode({ type: 'TEXT', props: { nodeValue: textString } }),
  //       );
  //       textString = '';
  //     }
  //     vChildren.push(virtualChild);
  //   } else {
  //     textString += ` ${virtualChild}`;
  //   }
  // });
  textString &&
    vChildren.push(
      new VNode({ type: 'TEXT', props: { nodeValue: textString } }),
    );
  return new VNode({
    type,
    props: props,
    children: vChildren.length ? vChildren : undefined,
  });
};

export const createElement = function (vnode: VNode) {
  let el;

  if (!vnode.type) {
    return;
  }

  if (vnode.type === 'TEXT' && vnode.props?.nodeValue) {
    el = document.createTextNode(
      JSON.stringify(vnode?.props?.nodeValue || vnode) || '',
    );
  } else {
    let typeName = typeof vnode.type === 'function' ? vnode.type() : vnode.type;
    const isCustomTag = isCustomComponent(typeName);
    el = document.createElement(typeName);
    if (isCustomTag) {
      vnode.$parent = 'a';
    }
    //<K extends keyof HTMLElementTagNameMap>
  }

  if (vnode.props) {
    updateProperties(vnode);
  }

  return el;
};

export const updateProperties = function (vnode: VNode) {
  if (!vnode.element || !vnode.props) {
    return;
  }

  Object.keys(vnode.props).forEach((key) => {
    const currentValue = vnode.props[key];

    if (key === 'style' && vnode.element instanceof HTMLElement) {
      setStyle(vnode.element, currentValue);
    }
  });

  // const updateByKey = (currentKey: string, oldKey: string) => {
  //   let oldValue = oldProps[oldKey] || '',
  //     currentValue = props[currentKey] || '';
  //   if (
  //     (typeof currentValue === 'function' || typeof oldValue === 'function') &&
  //     currentKey.substring(0, 2) === 'on'
  //   ) {
  //     if (currentValue) {
  //       vnode.element?.addEventListener(
  //         currentKey.toLowerCase().substring(2),
  //         () => {},
  //       );
  //     }
  //     if (!oldValue && currentValue) {
  //       dom.addEventListener(
  //         currentKey.slice(2).toLowerCase(),
  //         currentValue,
  //         false,
  //       );
  //     }
  //     // else if(oldListener && !currentListener){
  //     //   dom.removeEventListener(key.slice(2).toLowerCase(),oldListener,false);
  //     // }else {
  //     //   dom.removeEventListener(key.slice(2).toLowerCase(),oldListener,false);
  //     //   dom.addEventListener(key.slice(2).toLowerCase(), currentListener , false);
  //     // }
  //   } else if (currentKey === 'style') {
  //     if (currentValue) {
  //       let style = '';
  //       Object.keys(currentValue).map((s) => {
  //         style += `${camelCaseToHyphen(s)}:${props.style[s]};`;
  //       });
  //       dom.style = style;
  //     } else {
  //       dom.style = '';
  //     }
  //   } else if (currentKey === 'nodeValue') {
  //     dom['nodeValue'] = currentValue || '';
  //   } else if (currentKey === 'children') {
  //     dom['$children'] = currentValue;
  //   } else {
  //     dom[currentKey] = currentValue;
  //   }
  // };

  // const currentKeys: string[] = Object.keys(props) || [],
  //   oldKeys: string[] = Object.keys(oldProps);

  // currentKeys.forEach((key) => {
  //   updateByKey(key, key);
  //   if (oldProps[key] !== undefined) {
  //     const index = oldKeys.indexOf(key);
  //     if (index > -1) {
  //       oldKeys.splice(index, 1);
  //     }
  //   }
  // });
  //
  // oldKeys.forEach((key) => {
  //   updateByKey(key, key);
  // });
};
//
export function setStyle<T extends keyof CSSStyleDeclaration>(
  dom: HTMLElement,
  props: { [T: string]: any },
) {
  const style = dom.style;

  Object.keys(props).forEach((name: any) => {
    if (name === 'float') {
      name = 'cssFloat';
    }

    if (name.includes('--')) {
      style.setProperty(name, props[name]);
    } else {
      if (style.hasOwnProperty(name)) {
        style[name] = props[name];
      }
    }
  });
}

export function mergeProperty(vnode: VNode, props: { [k: string]: any }) {
  Object.keys(vnode.props).forEach((key) => {
    if (props.hasOwnProperty(key)) {
      vnode.props[key] = props[key];
    } else {
      vnode.props[key] = null;
    }
  });

  Object.keys(props).forEach((key) => {
    vnode.props[key] = props[key];
  });
}

export function isCustomComponent(name: string) {
  name = name.toLowerCase();
  return componentNames.includes(name);
}

export function Fragment(type: any, props: any, children: any) {
  return 'template';
}

// interface VNodeQueueItemType {
//   old?: VNode[];
//   new?: VNode[];
//   parentEl: HTMLElement;
// }
//
// interface ComponentQueueItem {
//   container: any;
//   VirtualDom?: VNode | null;
//   newVirtualDom?: VNode | null;
//   callback?: Function;
//   status: 'pending' | 'calculating';
// }

// let VNodeQueue: VNodeQueueItemType[] = [];
// let componentQueue: ComponentQueueItem[] = [];
// let currentComponent: ComponentQueueItem | undefined;

// export function pushComponentQueue(
//   container: any,
//   VirtualDom?: VNode | null,
//   newVirtualDom?: VNode | null,
//   callback?: Function,
// ) {
//   componentQueue.push({
//     container,
//     VirtualDom,
//     newVirtualDom,
//     callback,
//     status: 'pending',
//   });
//
//   requestIdleCallback(loopQueue);
// }

// const loopQueue = function (dealLine: any) {
//   while (dealLine.timeRemaining() > 0 && VNodeQueue.length) {
//     nextVNode();
//   }
//
//   /** 是否有该完结任务 */
//   if (!VNodeQueue.length) {
//     if (currentComponent) {
//       currentComponent.callback && currentComponent.callback(true);
//       currentComponent = undefined;
//       // VNodeQueue = null;
//     }
//     // requestIdleCallback(loopQueue);
//   }
//
//   /** 继续推进组件任务队列 */
//   if (componentQueue.length && !currentComponent) {
//     VNodeQueue.push({
//       parentEl: componentQueue[0].container,
//       old: componentQueue[0].VirtualDom ? [componentQueue[0].VirtualDom] : [],
//       new: componentQueue[0].newVirtualDom
//         ? [componentQueue[0].newVirtualDom]
//         : [],
//     });
//     currentComponent = componentQueue[0];
//     componentQueue.shift();
//     // requestIdleCallback(loopQueue);
//   } else {
//     // requestIdleCallback(loopQueue);
//   }
//   requestIdleCallback(loopQueue);
// };

// const nextVNode = function () {
//   if (!VNodeQueue || !VNodeQueue.length) {
//     return;
//   }
//
//   const list = VNodeQueue[0].old || [],
//     newList = VNodeQueue[0].new || [],
//     parentEl = VNodeQueue[0].parentEl;
//
//   let oldStartIndex = 0,
//     newStartIndex = 0,
//     oldEndIndex = list.length ? list.length - 1 : 0,
//     newEndIndex = newList.length ? newList.length - 1 : 0;
//   let oldStartNode: VNode | undefined = list[0],
//     oldEndNode: VNode | undefined = list[oldEndIndex],
//     newStartNode: VNode | undefined = newList[0],
//     newEndNode: VNode | undefined = newList[newEndIndex];
//   let idxInOld: VNode | undefined,
//     oldNodeMap: { [k: string]: VNode } = {};
//   // debugger;
//   while (newStartIndex <= newEndIndex) {
//     if (isSameNode(oldStartNode, newStartNode)) {
//       //头头相同
//       patchVNode(parentEl, oldStartNode, newStartNode);
//       oldStartNode = list[++oldStartIndex];
//       newStartNode = newList[++newStartIndex];
//     } else if (isSameNode(oldEndNode, newEndNode)) {
//       //尾尾相同
//       patchVNode(parentEl, oldEndNode, newEndNode);
//       oldEndNode = list[--oldEndIndex];
//       newEndNode = newList[--newEndIndex];
//     } else if (isSameNode(oldStartNode, newEndNode)) {
//       //头尾相同
//       patchVNode(parentEl, oldStartNode, newEndNode);
//       oldStartNode = list[++oldStartIndex];
//       newEndNode = newList[--newEndIndex];
//     } else if (isSameNode(oldEndNode, newStartNode)) {
//       //尾头相同
//       patchVNode(parentEl, oldEndNode, newStartNode);
//       oldEndNode = list[--oldEndIndex];
//       newStartNode = newList[++newStartIndex];
//     } else {
//       //创建剩下的旧元素的map映射
//       if (!oldNodeMap) {
//         oldNodeMap = creatNodeMap(list, oldStartIndex, oldEndIndex);
//       }
//       //是否有key
//       const key = newStartNode?.key;
//       idxInOld = key
//         ? oldNodeMap[key]
//         : findNode(newStartNode, list, oldStartIndex, oldEndIndex);
//       //匹配成功
//       if (idxInOld && isSameNode(idxInOld, newStartNode)) {
//         // idxInOld.children = [];
//         // idxInOld.element?.parentNode?.removeChild(<Node>idxInOld.element);
//         // // idxInOld.element = createElement(idxInOld);
//         // list.splice(oldStartIndex, 0, idxInOld);
//         // insertBefore(parentEl, idxInOld.element, oldStartNode.elm);
//         patchVNode(parentEl, idxInOld, newStartNode, list, oldStartIndex);
//       } else {
//         /** 新增 */
//         patchVNode(parentEl, undefined, newStartNode, list, oldStartIndex);
//       }
//       idxInOld = undefined;
//       //TODO:如果移动后不删除旧数据则需+1
//       oldEndNode = list[++oldEndIndex];
//       oldStartNode = list[++oldStartIndex];
//       newStartNode = newList[++newStartIndex];
//     }
//   }
//
//   if (oldStartIndex <= oldEndIndex) {
//     for (let i = oldEndIndex; i >= oldStartIndex; i--) {
//       patchVNode(parentEl, list[i], undefined, list, i);
//       // if (item) {
//       //   if (item.element) {
//       //     item.element.parentNode?.removeChild(<Node>item.element);
//       //   } else {
//       //     item.element = createElement(item);
//       //     parentEl.append(item.element || '');
//       //     patchChildren(item.element, item.children, []);
//       //   }
//       //   list.splice(i, 1);
//       // }
//     }
//   }
//
//   VNodeQueue.shift();
// };

// export function patchVNode(
//   container: HTMLElement,
//   oldNode?: VNode,
//   newNode?: VNode,
//   nodeList: VNode[] = [],
//   newIndex: number = -1,
//   oldIndex: number = -1,
// ) {
//   if (!oldNode && !newNode) {
//     return;
//   }

/** 一致则无需修改 */
//   if (oldNode === newNode) {
//     return;
//   }
//
//   const preIndex =
//     newIndex > nodeList.length - 1 ? nodeList.length - 1 : newIndex;
//   const preNode = nodeList[preIndex];
//   const preEl = (preNode && preNode.element) || undefined;
//
//   /** 新增 */
//   if (!oldNode && newNode) {
//     newNode.element = createElement(newNode);
//     nodeList?.splice(newIndex, 0, newNode);
//     insertBefore(container, newNode.element, preEl);
//     patchChildren(newNode.element, undefined, newNode.children);
//   } else if (oldNode && !newNode) {
//     /** 移除 */
//     if (oldNode.element) {
//       oldNode.element.parentNode?.removeChild(oldNode.element);
//     }
//     nodeList?.splice(newIndex, 1);
//   } else if (oldNode && newNode) {
//     if (
//       (oldNode.key && newNode.key && oldNode.key === newNode.key) ||
//       oldNode.type === newNode.type
//     ) {
//       updateProperties(oldNode.element, newNode.props, oldNode.props);
//       newNode.element = oldNode.element;
//     } else {
//       newNode.element = createElement(newNode);
//       updateProperties(newNode.element, newNode.props, undefined);
//       if (oldNode.element) {
//         oldNode.element.parentNode?.removeChild(oldNode.element);
//       }
//       if (newNode.element) {
//         insertBefore(container, newNode.element, preEl);
//       }
//     }
//
//     if (newIndex > -1 && oldIndex > -1) {
//       nodeList?.splice(newIndex, 0, newNode);
//       nodeList?.splice(oldIndex, 1);
//       insertBefore(container, newNode.element, preEl);
//     }
//
//     patchChildren(oldNode.element, oldNode.children, newNode.children);
//   }
// }

// const patchChildren = function (
//   parentEl: HTMLElement | Text | undefined | null,
//   old?: VNode[] | null,
//   newV?: VNode[] | null,
// ) {
//   if (parentEl instanceof HTMLElement && (old || newV)) {
//     VNodeQueue?.push({
//       old: old || [],
//       new: newV || [],
//       parentEl: parentEl,
//     });
//   }
// };

// const requestIdleCallback = function (
//   callback: any,
//   options: any = { timeout: 1000 * 10 },
// ) {
//   if (window.requestIdleCallback) {
//     return window.requestIdleCallback(callback, options);
//   } else {
//     return setTimeout(callback, options.timeout);
//   }
// };
