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
  status: 'pending' | 'calculating';
}

let VNodeQueue: VNodeQueueItemType[] = [];
let componentQueue: ComponentQueueItem[] = [];
let currentComponent: ComponentQueueItem | undefined;

export function pushComponentQueue(
  container: any,
  VirtualDom?: VNode | null,
  newVirtualDom?: VNode | null,
  callback?: Function,
) {
  componentQueue.push({
    container,
    VirtualDom,
    newVirtualDom,
    callback,
    status: 'pending',
  });

  requestIdleCallback(loopQueue);
}

const loopQueue = function (dealLine: any) {
  // console.log(componentQueue);
  while (dealLine.timeRemaining() > 0 && VNodeQueue.length) {
    nextVNode();
  }

  /** 是否有该完结任务 */
  if (!VNodeQueue.length) {
    if (currentComponent) {
      currentComponent.callback && currentComponent.callback(true);
      currentComponent = undefined;
      // VNodeQueue = null;
    }
    // requestIdleCallback(loopQueue);
  }

  /** 继续推进组件任务队列 */
  if (componentQueue.length && !currentComponent) {
    VNodeQueue.push({
      parentEl: componentQueue[0].container,
      old: componentQueue[0].VirtualDom ? [componentQueue[0].VirtualDom] : [],
      new: componentQueue[0].newVirtualDom
        ? [componentQueue[0].newVirtualDom]
        : [],
    });
    currentComponent = componentQueue[0];
    componentQueue.shift();
    // requestIdleCallback(loopQueue);
  } else {
    // requestIdleCallback(loopQueue);
  }
  requestIdleCallback(loopQueue);
};

const nextVNode = function () {
  if (!VNodeQueue || !VNodeQueue.length) {
    return;
  }

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
        // idxInOld.children = [];
        // idxInOld.element?.parentNode?.removeChild(<Node>idxInOld.element);
        // // idxInOld.element = createElement(idxInOld);
        // list.splice(oldStartIndex, 0, idxInOld);
        // insertBefore(parentEl, idxInOld.element, oldStartNode.elm);
        patchVNode(parentEl, idxInOld, newStartNode, list, oldStartIndex);
      } else {
        /** 新增 */
        patchVNode(parentEl, undefined, newStartNode, list, oldStartIndex);
      }
      idxInOld = undefined;
      oldEndNode = list[++oldEndIndex];
      oldStartNode = list[++oldStartIndex];
      newStartNode = newList[++newStartIndex];
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldEndIndex; i >= oldStartIndex; i--) {
      patchVNode(parentEl, list[i], undefined, list, i);
      // if (item) {
      //   if (item.element) {
      //     item.element.parentNode?.removeChild(<Node>item.element);
      //   } else {
      //     item.element = createElement(item);
      //     parentEl.append(item.element || '');
      //     patchChildren(item.element, item.children, []);
      //   }
      //   list.splice(i, 1);
      // }
    }
  }

  VNodeQueue.shift();
};

const patchVNode = function (
  parentEl: HTMLElement,
  old?: VNode,
  newV?: VNode,
  nodeList?: VNode[],
  oldStartIndex: number = -1,
  prevEl?: HTMLElement,
) {
  /** 一致则无需修改 */
  if (old === newV || (old?.key && newV?.key && old.key === newV.key)) {
    return;
  }

  /** 新增 */
  if (!old && newV) {
    newV.element = createElement(newV);
    nodeList?.splice(oldStartIndex, 0, newV);
    insertBefore(parentEl, newV.element, prevEl);
    patchChildren(newV.element, undefined, newV.children);
  } else if (old?.element && !newV) {
    /** 移除 */
    old.element.parentNode?.removeChild(old.element);
    nodeList?.splice(oldStartIndex, 1);
  } else if (old && newV) {
    /**  替换旧的 */
    if ((old.key && newV.key) || old?.type !== newV?.type) {
      newV.element = createElement(newV);
      old.element?.parentNode?.removeChild(old.element);
      nodeList?.splice(oldStartIndex, 0, newV);
      insertBefore(parentEl, newV.element, prevEl);
      patchChildren(newV.element, undefined, newV?.children);
    } else {
      updateProperties(old.element, newV?.props || {}, old.props || {});
      old.props = newV.props || undefined;
      patchChildren(old.element, old.children, newV.children);
    }
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

/** 判断节点是否可以复用 */
const isSameNode = function (old?: VNode, newV?: VNode) {
  if (!old || !newV) {
    return false;
  }

  return (
    (old.key && newV.key && old.key === newV.key) ||
    (old.type === newV.type && old.props && newV.props)
  );
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

export const createVirtualElement = function (
  type: any,
  props: { [k: string]: any },
  ...children: Array<any>
) {
  let textString = '';
  const vChildren: VNode[] = [];

  for (let i = 0; i < children.length; i++) {
    let child = children[i];

    /** 处理 <></>*/
    // while (child && !child.type) {
    //   children.splice(i, 1, ...(child.children || []));
    //   child = children[i];
    // }

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

export const createElement = function (vnode: VNode) {
  let el;

  if (!vnode.type) {
    return;
  }

  if (vnode.type === 'TEXT' && vnode.props?.nodeValue) {
    el = document.createTextNode(JSON.stringify(vnode.props.nodeValue) || '');
  } else {
    let typeName = typeof vnode.type === 'function' ? vnode.type() : vnode.type;
    el = document.createElement(typeName);
    //<K extends keyof HTMLElementTagNameMap>
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
      dom['nodeValue'] = currentValue || '';
    } else if (currentKey === 'children') {
      dom['$children'] = currentValue;
    } else {
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
};

export function Fragment(type: any, props: any, children: any) {
  // console.log('kk');
  // console.log(type, props, children, 'k');

  return 'template';
}
