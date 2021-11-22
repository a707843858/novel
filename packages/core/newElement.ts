import VNode from './VNode';
import { insertBefore } from './utils';

interface VNodeQueueItemType {
  old?: VNode[];
  new?: VNode[];
  parentEl: HTMLElement;
}

let VNodeQueue: VNodeQueueItemType[] = [],
  renderQueue: {
    container: HTMLElement;
    vNode: VNode;
  }[] = [];

export const createVirtalElement = function (
  type: any,
  props: { [k: string]: any },
  ...children: Array<any>
) {
  children = children.map((child) => {
    return typeof child === 'object'
      ? new VNode(child)
      : new VNode({ type: 'TEXT', props: { nodeValue: child } });
  });
  return new VNode({
    type,
    props: props,
    children: children?.length ? children : undefined,
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
  virtalDoM?: VNode | null,
  newVirtalDom?: VNode | null,
) {
  return new Promise((reslove) => {
    const nextVNode = function () {
      if (!VNodeQueue.length) {
        return;
      }

      // console.log(VNodeQueue, 'vvv');

      const list = VNodeQueue[0].old || [],
        newList = VNodeQueue[0].new || [],
        parentEl = VNodeQueue[0].parentEl;

      let oldStartIndex = 0,
        newStartIndex = 0,
        oldEndIndex = list.length - 1,
        newEndIndex = newList.length - 1;
      let oldStartNode: VNode | undefined = list[0],
        oldEndNode: VNode | undefined = list[oldEndIndex],
        newStartNode: VNode | undefined = newList[0],
        newEndNode: VNode | undefined = newList[newEndIndex];
      let idxInOld: VNode | undefined,
        oldNodeMap: { [k: string]: VNode } | undefined;
      // debugger;
      // console.log('b');
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
          // console.log('B');
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
            idxInOld.element.parentNode.removeChild(idxInOld.element);
            // idxInOld.element = createElement(idxInOld);
            list.splice(oldStartIndex, 0, idxInOld);
            insertBefore(parentEl, idxInOld.element, oldStartNode.elm);
          } else {
            newStartNode.element = createElement(newStartNode);
            list.splice(oldStartIndex, 0, newStartNode);
            // console.log(parentEl, 'container');
            insertBefore(
              parentEl,
              newStartNode.element,
              oldStartNode?.element || '',
            );
            patchChildren(newStartNode.element, [], newStartNode.children);
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
          // console.log(item,'item');
          if (item.element) {
            item.element.parentNode.removeChild(item.element);
          } else {
            item.element = createElement(item);
            parentEl.append(item.element);
            patchChildren(item.element, item.children, []);
          }
          list.splice(i, 1);
        }
      }

      VNodeQueue.shift();
    };

    const isSameNode = function (old?: VNode, newV?: VNode) {
      if (!old || !newV) {
        return false;
      }
      // console.log(old,newV,'aaa');

      return (
        (old.key && newV.key && old.key === newV.key) ||
        (old.type === newV.type &&
          old.props &&
          newV.props )
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

      if (old?.props && newV?.props) {
        old.props = newV.props;
        old.patch = 'update';
        updateProperties(old.element,newV.props);
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
      parentEl: HTMLElement,
      old?: VNode[],
      newV?: VNode[],
    ) {
      VNodeQueue.push({ old: old || [], new: newV || [], parentEl: parentEl });
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
      while (dealLine.timeRemaining() > 0 && VNodeQueue.length) {
        nextVNode();
      }

      if (!VNodeQueue.length) {
        reslove(true);
      }

      //结束任务,开始渲染
      // if (!VNodeQueue) {
      //   //currentFiber.length && !currentNewFiber.length
      //   //分解子任务
      //   if (rootFiber && rootFiber.children && !renderQueue.length) {
      //     rootFiber.element &&
      //       childToTask(rootFiber.element, rootFiber.children || [,]);
      //     console.log(renderQueue, 'jj');
      //   }

      //   if (renderQueue.length) {
      //     console.log('b');
      //     getNextRender();
      //   }
      //   // if (!currentRenderFiber && rootFiber) {
      //   //   currentRenderFiber = {
      //   //     parentDom: rootFiber.element,
      //   //     list: rootFiber.children,
      //   //   };
      //   // }
      //   // commitRoot(rootFiber.children || [], rootFiber.element);
      // }

      requestIdleCallback(loopTask);
    };

    VNodeQueue.push({
      parentEl: container,
      old: virtalDoM ? [virtalDoM] : [],
      new: newVirtalDom ? [newVirtalDom] : [],
    });
    requestIdleCallback(loopTask);

  });
  // console.log(virtalDoM, 'vvvv');
};

export const createElement = function (vnode: VNode) {
  let el;

  if (!vnode.type) {
    return;
  }

  if (vnode.type === 'TEXT') {
    el = document.createTextNode(vnode.props.nodeValue || '');
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
  props?: { [k: string]: any },
) {
  if (!props) {
    return;
  }

  Object.keys(props).map((key) => {
    if (typeof props[key] === 'function') {
      dom.addEventListener(key.slice(2).toLowerCase(), props[key], false);
    } else if (key !== 'children') {
      // let name = key === 'className' ? 'class' : '';
      dom[key] = props[key];
    }
  });
};
