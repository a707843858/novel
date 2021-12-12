import VNode from './VNode';
import { insertBefore, camelCaseToHyphen } from './utils';

interface VNodeQueueItemType {
  old?: VNode[];
  new?: VNode[];
  parentEl: HTMLElement;
}

interface ComponentQueueItem {
  container: any;
  VirtualDom?: VNode | null;
  newVirtualDom?: VNode | null;
  callback?: Function;
}

let VNodeQueue: VNodeQueueItemType[] | null = [];
let componentQueue: ComponentQueueItem[] = [];

export function pushComponentQueue(
  container: any,
  VirtualDom?: VNode | null,
  newVirtualDom?: VNode | null,
  callback?: Function,
) {
  if (VNodeQueue?.length) {
  } else {
    componentQueue.push({ container, VirtualDom, newVirtualDom, callback });
  }
}

const loopQueue = function (dealLine: any) {
  // while (dealLine.timeRemaining() > 0 && VNodeQueue?.length) {
  //   nextVNode();
  // }
  //
  // if (VNodeQueue && !VNodeQueue.length) {
  //   callback && callback(true);
  //   VNodeQueue = null;
  //   // resolve(true);
  // } else {
  //   requestIdleCallback(loopTask);
  // }
};

export const createVirtualElement = function (
  type: any,
  props: { [k: string]: any },
  ...children: Array<any>
) {
  let textString = '';
  const vChildren: VNode[] = [];
  children.map((child) => {
    if (typeof child === 'object') {
      if (textString) {
        vChildren.push(
          new VNode({ type: 'TEXT', props: { nodeValue: textString } }),
        );
        textString = '';
      }
      vChildren.push(child);
    } else {
      textString += ` ${child}`;
    }
  });
  textString &&
    vChildren.push(
      new VNode({ type: 'TEXT', props: { nodeValue: textString } }),
    );
  textString = '';
  // children = children.map((child) => {
  //   console.log(child,'=dd');
  //   return typeof child === 'object'
  //     ? new VNode(child)
  //     : new VNode({ type: 'TEXT', props: { nodeValue: child } });
  // });
  return new VNode({
    type,
    props: props,
    children: vChildren.length ? vChildren : undefined,
  });
};

const requestIdleCallback = function (
  callback: any,
  options: any = { timeout: 1000 * 10 },
) {
  if (window.requestIdleCallback) {
    return window.requestIdleCallback(callback, options);
  } else {
    return setTimeout(callback, options.timeout);
  }
};

export const newRender = function (
  container: any,
  VirtualDom?: VNode | null,
  newVirtualDom?: VNode | null,
  callback?: Function,
) {
  // debugger;
  // return new Promise((resolve) => {
  //   debugger;
  const nextVNode = function () {
    if (!VNodeQueue || !VNodeQueue.length) {
      return;
    }

    // console.log(VNodeQueue, 'vvv');

    const list = VNodeQueue[0].old || [],
      newList = VNodeQueue[0].new || [],
      parentEl = VNodeQueue[0].parentEl;

    let oldStartIndex = 0,
      newStartIndex = 0,
      oldEndIndex = list.length ? list.length - 1 : 0,
      newEndIndex = newList.length ? newList.length - 1 : 0;
    let oldStartNode: VNode | undefined = list[0],
      oldEndNode: VNode | undefined = list[oldEndIndex],
      newStartNode: VNode | undefined = newList[0],
      newEndNode: VNode | undefined = newList[newEndIndex];
    let idxInOld: VNode | undefined,
      oldNodeMap: { [k: string]: VNode } = {};
    // debugger;
    while (newStartIndex <= newEndIndex) {
      if (isSameNode(oldStartNode, newStartNode)) {
        //头头相同
        patchVNode(parentEl, oldStartNode, newStartNode);
        oldStartNode = list[++oldStartIndex];
        newStartNode = newList[++newStartIndex];
      } else if (isSameNode(oldEndNode, newEndNode)) {
        //尾尾相同
        patchVNode(parentEl, oldEndNode, newEndNode);
        oldEndNode = list[--oldEndIndex];
        newEndNode = newList[--newEndIndex];
      } else if (isSameNode(oldStartNode, newEndNode)) {
        //头尾相同
        patchVNode(parentEl, oldStartNode, newEndNode);
        oldStartNode = list[++oldStartIndex];
        newEndNode = newList[--newEndIndex];
      } else if (isSameNode(oldEndNode, newStartNode)) {
        //尾头相同
        patchVNode(parentEl, oldEndNode, newStartNode);
        oldEndNode = list[--oldEndIndex];
        newStartNode = newList[++newStartIndex];
      } else {
        //创建剩下的旧元素的map映射
        if (!oldNodeMap) {
          oldNodeMap = creatNodeMap(list, oldStartIndex, oldEndIndex);
        }
        //是否有key
        const key = newStartNode?.key;
        idxInOld = key
          ? oldNodeMap[key]
          : findNode(newStartNode, list, oldStartIndex, oldEndIndex);
        //匹配成功
        if (idxInOld && isSameNode(idxInOld, newStartNode)) {
          idxInOld.children = [];
          idxInOld.element?.parentNode?.removeChild(<Node>idxInOld.element);
          // idxInOld.element = createElement(idxInOld);
          list.splice(oldStartIndex, 0, idxInOld);
          insertBefore(parentEl, idxInOld.element, oldStartNode.elm);
        } else {
          newStartNode.element = createElement(newStartNode);

          list.splice(oldStartIndex, 0, newStartNode);
          // console.log(parentEl,newStartNode.element, 'container');
          insertBefore(parentEl, newStartNode.element, oldStartNode?.element);
          patchChildren(newStartNode.element, undefined, newStartNode.children);
        }
        idxInOld = undefined;
        oldEndNode = list[++oldEndIndex];
        oldStartNode = list[++oldStartIndex];
        newStartNode = newList[++newStartIndex];
      }
    }

    if (oldStartIndex <= oldEndIndex) {
      for (let i = oldEndIndex; i >= oldStartIndex; i--) {
        const item = list[i];
        if (item) {
          if (item.element) {
            item.element.parentNode?.removeChild(<Node>item.element);
          } else {
            item.element = createElement(item);
            parentEl.append(item.element || '');
            patchChildren(item.element, item.children, []);
          }
          list.splice(i, 1);
        }
      }
    }

    VNodeQueue.shift();
  };

  const isSameNode = function (old?: VNode, newV?: VNode) {
    if (!old || !newV) {
      return false;
    }

    return (
      (old.key && newV.key && old.key === newV.key) ||
      (old.type === newV.type && old.props && newV.props)
    );
  };

  const patchVNode = function (
    parentEL: HTMLElement,
    old?: VNode,
    newV?: VNode,
  ) {
    //一致则无需修改
    if (old === newV) {
      return;
    }

    //新增
    // if (!old && newV) {
    //   //新增
    //   old = newV;
    //   renderQueue.push({ container: parentEL, vNode: old });
    // }

    // if (old?.element && !newV) {
    //   //移除
    //   old.patch = 'remove';
    //   renderQueue.push({ container: parentEL, vNode: old });
    // }

    // if (old?.key && newV?.key) {
    //   return false;
    // }

    if (old) {
      console.log(old.props);
      updateProperties(old.element, newV?.props || {}, old.props || {});
      old.props = newV?.props || undefined;
      // renderQueue.push({ container: parentEL, vNode: old });
    }
    // if {
    //   //创建新的 覆盖旧的
    //   old = { ...old, type: newV?.type, props: newV?.props, path: 'replace' };
    //   renderQueue.push({ container: parentEL, vNode: old });
    // }

    //子元素
    if (old?.children || newV?.children) {
      patchChildren(old?.element, old?.children, newV?.children);
    }
  };

  const patchChildren = function (
    parentEl: HTMLElement | Text | undefined | null,
    old?: VNode[] | null,
    newV?: VNode[] | null,
  ) {
    if (parentEl instanceof HTMLElement && (old || newV)) {
      VNodeQueue?.push({
        old: old || [],
        new: newV || [],
        parentEl: parentEl,
      });
    }
  };

  /** 为旧节创建映射 */
  const creatNodeMap = function (
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
  };

  /** 在节点组中寻找相似的 */
  const findNode = function (
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
  };

  const loopTask = function (dealLine: any) {
    while (dealLine.timeRemaining() > 0 && VNodeQueue?.length) {
      nextVNode();
    }

    if (VNodeQueue && !VNodeQueue.length) {
      callback && callback(true);
      VNodeQueue = null;
      // resolve(true);
    } else {
      requestIdleCallback(loopTask);
    }
  };

  VNodeQueue = [
    {
      parentEl: container,
      old: VirtualDom ? [VirtualDom] : [],
      new: newVirtualDom ? [newVirtualDom] : [],
    },
  ];
  requestIdleCallback(loopTask);
  // });
};

export const createElement = function (vnode: VNode) {
  let el;

  if (!vnode.type) {
    return;
  }

  if (vnode.type === 'TEXT' && vnode.props?.nodeValue) {
    el = document.createTextNode(JSON.stringify(vnode.props.nodeValue) || '');
  } else {
    el = document.createElement(vnode.type);
  }

  if (vnode.props) {
    updateProperties(el, vnode.props);
  }

  return el;
};

export const updateProperties = function (
  dom: any,
  props: { [k: string]: any } = {},
  oldProps: { [k: string]: any } = {},
) {
  if (!dom) {
    return;
  }
  console.log(props, oldProps);

  const updateByKey = (currentKey: string, oldKey: string) => {
    let oldValue = oldProps[oldKey] || '',
      currentValue = props[currentKey] || '';

    if (currentValue instanceof Function || oldValue instanceof Function) {
      if (!oldValue && currentValue) {
        dom.addEventListener(
          currentKey.slice(2).toLowerCase(),
          currentValue,
          false,
        );
      }
      // else if(oldListener && !currentListener){
      //   dom.removeEventListener(key.slice(2).toLowerCase(),oldListener,false);
      // }else {
      //   dom.removeEventListener(key.slice(2).toLowerCase(),oldListener,false);
      //   dom.addEventListener(key.slice(2).toLowerCase(), currentListener , false);
      // }
    } else if (currentKey === 'style') {
      if (currentValue) {
        let style = '';
        Object.keys(currentValue).map((s) => {
          style += `${camelCaseToHyphen(s)}:${props.style[s]};`;
        });
        dom.style = style;
      } else {
        dom.style = '';
      }
    } else if (currentKey === 'nodeValue') {
      dom['nodeValue'] = currentValue;
    } else if (currentKey !== 'children') {
      dom[currentKey] = currentValue;
    }
  };

  const currentKeys: string[] = Object.keys(props) || [],
    oldKeys: string[] = Object.keys(oldProps);

  currentKeys.forEach((key) => {
    updateByKey(key, key);
    if (oldProps[key] !== undefined) {
      const index = oldKeys.indexOf(key);
      if (index > -1) {
        oldKeys.splice(index, 1);
      }
    }
  });

  oldKeys.forEach((key) => {
    updateByKey(key, key);
  });

  // Object.keys(props).map((key) => {
  //   if (typeof props[key] === 'function') {
  //     let currentListener = props[key];
  //     let oldListener = oldProps[key];
  //     if (!oldListener && currentListener) {
  //       dom.addEventListener(
  //         key.slice(2).toLowerCase(),
  //         currentListener,
  //         false,
  //       );
  //     }
  //     // else if(oldListener && !currentListener){
  //     //   dom.removeEventListener(key.slice(2).toLowerCase(),oldListener,false);
  //     // }else {
  //     //   dom.removeEventListener(key.slice(2).toLowerCase(),oldListener,false);
  //     //   dom.addEventListener(key.slice(2).toLowerCase(), currentListener , false);
  //     // }
  //   } else if (key === 'style') {
  //     let style = '';
  //     Object.keys(props.style).map((s) => {
  //       style += `${camelCaseToHyphen(s)}:${props.style[s]};`;
  //     });
  //
  //     dom.style = style;
  //   } else if (key === 'nodeValue') {
  //     console.log(props[key], props);
  //     dom[key] = String(props[key]);
  //   } else if (key !== 'children') {
  //     // console.log(key, dom, props[key]);
  //     // let name = key === 'className' ? 'class' : '';
  //
  //     dom[key] = props[key];
  //   }
  // });
};
