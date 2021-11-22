import VNode from './VNode';

export type VNodeTag = string | null;
export type VNodeAttributes = { [k: string]: any } | null;
export type VNodeKey = string | number | null;
export type VNodeChildren = Array<string> | null;
export type VNodeElement = HTMLElement | Text | null;

export interface FiberProps {
  [k: string]: any;
  children?: any[] | null;
}

export interface Fiber {
  type: string;
  props: FiberProps;
  element?: HTMLElement | Text | null;
  key?: VNodeKey;
  children?: Fiber[];
  parentFiber?: any | null;
  childFiber?: any | null;
  siblingFiber?: any | null;
  action?: 'add' | 'remove' | 'replace' | 'keep' | 'update' | 'insert';
  maxDep?: number;
  dep?: number;
}

export interface DiffrentNode {
  fiber: Fiber[];
  newFiber: Fiber[];
}

// export const createVirtalElement = function (
//   type: any,
//   props: FiberProps,
//   ...children: Array<any>
// ) {
//   children = children.map((child) => {
//     return typeof child === 'object' ? child : createTextElement(child);
//   });
//   return { type, props: props || {}, children, action: 'add' };
// };

export const createTextElement = function (text: string) {
  return {
    type: 'TEXT',
    props: { nodeValue: text },
    action: 'add',
  };
};

export const createElement = function (
  type: any,
  props: FiberProps,
  ...children: Array<any>
) {
  children = children
    ? children.map((child) => {
        return child
          ? typeof child === 'object'
            ? child
            : createTextElement(child)
          : null;
      })
    : [];
  return { type, props, children, action: 'add' };
};

export const updateProperties = function (
  dom: any,
  props: { [k: string]: any } = {},
) {
  if (!props) return;
  Object.keys(props).map((key) => {
    if (typeof props[key] === 'function') {
      dom.addEventListener(key.slice(2).toLowerCase(), props[key], false);
    } else if (key !== 'children') {
      // let name = key === 'className' ? 'class' : '';
      dom[key] = props[key];
    }
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

const createDom = function (vNode: any) {
  let dom: any;
  if (vNode.type === 'TEXT') {
    dom = document.createTextNode(vNode.props.nodeValue);
  } else {
    dom = document.createElement(vNode.type);
  }
  console.log(dom);
  updateProperties(dom, vNode.props);
  return dom;
};

export const render = function (
  vNode: any,
  container: any,
  callback?: (fiber: Fiber | null) => void,
) {
  //if vNode is empty
  if (!vNode) {
    return;
  }

  let currentFiber: Fiber,
    rootFiber: Fiber | null = {
      type: 'root',
      props: { children: [vNode] },
      element: container,
      dep: 1,
      maxDep: 1,
    };
  const commitRoot = function (fiber: Fiber) {
    if (!fiber) {
      return;
    }
    commitWorker(fiber);
  };
  const commitWorker = function (fiber?: Fiber) {
    if (!fiber) {
      return;
    }
    const parentDOM = fiber.parentFiber.element;
    if (fiber.action === 'add') {
      fiber.element = createDom(fiber);
      parentDOM.appendChild(fiber.element);
    }
    commitRoot(fiber.childFiber);
    commitRoot(fiber.siblingFiber);
    if (
      !fiber.childFiber &&
      !fiber.siblingFiber &&
      fiber.dep === rootFiber?.maxDep
    ) {
      callback && callback(rootFiber?.childFiber || null);
      rootFiber = null;
    }
    Reflect.deleteProperty(fiber, 'action');
    Reflect.deleteProperty(fiber, 'dep');
  };
  const getNextFiber = function (fiber: Fiber) {
    //前一个元素
    let prevSibling: Fiber = {
      type: '',
      props: {},
      element: null,
    };

    if (!fiber.action && !fiber.element) {
      fiber.action = 'add';
    }

    const vNodeChildren = fiber.props?.children || [];
    const childLen = vNodeChildren.length || 0;
    if (!fiber?.childFiber?.dep) {
      for (let i = 0; i < childLen; i++) {
        let child = vNodeChildren[i];
        if (!child) {
          continue;
        }
        const dep = (fiber.dep || 1) + 1;
        rootFiber && (rootFiber.maxDep = dep);

        let childFiber: Fiber = {
          type: child.type,
          props: child.props,
          parentFiber: fiber,
          element: null,
          action: child.action,
          dep,
        };
        if (i === 0) {
          fiber.childFiber = childFiber;
        } else {
          prevSibling.siblingFiber = childFiber;
        }
        prevSibling = childFiber;
      }
    }

    //
    if (fiber.childFiber && !fiber.childFiber.action) {
      // console.log(rootFiber, 'c');
      return fiber.childFiber;
    } else if (fiber.siblingFiber && !fiber.siblingFiber.action) {
      // console.log(fiber, 'b');
      return fiber.siblingFiber;
    } else {
      // console.log(fiber, 'p');
      return fiber.parentFiber || null;
    }
  };
  const loopTask = function (dealLine: any) {
    //寻找下一个节点
    while (dealLine.timeRemaining() > 0 && currentFiber) {
      // Incremental rendering
      // if (vNode.element) {
      //   console.log('new ccc');
      // } else {
      //   // First apply colours to a drawing
      currentFiber = getNextFiber(currentFiber);
      // }
    }
    //结束任务
    if (!currentFiber && rootFiber) {
      console.log('a');
      commitRoot(rootFiber.childFiber);
    }
    requestIdleCallback(loopTask);
  };
  currentFiber = rootFiber;
  requestIdleCallback(loopTask);

  // container.appendChild(dom);
};

//链表形式
export const IncrementalRender = function (
  container: any,
  virtalDoM: Fiber,
  newVirtalDom?: Fiber,
  callback?: (fiber: Fiber | null) => void,
) {
  let currentFiber: Fiber,
    currentNewFiber: Fiber,
    rootFiber: Fiber | null = {
      type: 'root',
      props: {},
      children: [virtalDoM],
      element: container,
      dep: 1,
      maxDep: 1,
    },
    newRootFiber: Fiber | null = newVirtalDom
      ? {
          type: 'root',
          props: { children: [newVirtalDom] },
          element: container,
          dep: 1,
          maxDep: 1,
        }
      : null,
    diffrentNode: DiffrentNode[] = [];

  // Dom submission
  const commitRoot = function (fiber: Fiber) {
    if (!fiber) {
      return;
    }
    commitWorker(fiber);
  };

  // Performing DOM operations
  const commitWorker = function (fiber?: Fiber) {
    if (!fiber) {
      return;
    }
    const parentDOM = fiber.parentFiber.element;
    if (fiber.action === 'add') {
      fiber.element = createDom(fiber);
      parentDOM.appendChild(fiber.element);
    }
    commitRoot(fiber.childFiber);
    commitRoot(fiber.siblingFiber);
    if (
      !fiber.childFiber &&
      !fiber.siblingFiber &&
      fiber.dep === rootFiber?.maxDep
    ) {
      callback && callback(rootFiber?.childFiber || null);
      rootFiber = null;
    }
    Reflect.deleteProperty(fiber, 'action');
    Reflect.deleteProperty(fiber, 'dep');
  };

  // Process the current node and submit the next task
  const getNextFiber = function (fiber: Fiber) {
    //前一个元素
    let prevSibling: Fiber = {
      type: '',
      props: {},
      element: null,
    };

    if (!fiber.action && !fiber.element) {
      fiber.action = 'add';
    }

    const vNodeChildren = fiber.children || [];
    const childLen = vNodeChildren.length || 0;
    if (!fiber?.childFiber?.dep) {
      for (let i = 0; i < childLen; i++) {
        let child = vNodeChildren[i];
        const dep = (fiber.dep || 1) + 1;
        rootFiber && (rootFiber.maxDep = dep);

        let childFiber: Fiber = {
          type: child.type,
          props: child.props,
          parentFiber: fiber,
          element: null,
          action: child.action,
          dep,
        };
        if (i === 0) {
          fiber.childFiber = childFiber;
        } else {
          prevSibling.siblingFiber = childFiber;
        }
        prevSibling = childFiber;
      }
    }

    //
    if (fiber.childFiber && !fiber.childFiber.action) {
      // console.log(rootFiber, 'c');
      return fiber.childFiber;
    } else if (fiber.siblingFiber && !fiber.siblingFiber.action) {
      // console.log(fiber, 'b');
      return fiber.siblingFiber;
    } else {
      // console.log(fiber, 'p');
      return fiber.parentFiber || null;
    }
  };

  //
  const getNextDiffrentFiber = function (diffrentNode: DiffrentNode[] = []) {
    const nextDiffrentNode: DiffrentNode[] = [];
    const diffrentNodeLen = diffrentNode.length || 0;
    for (let i = 0; i < diffrentNodeLen; i++) {
      const fiber = diffrentNode[i].fiber,
        newFiber = '';
    }
    const currentFiber = diffrentNode[0];
    const fiber = currentFiber.fiber || null,
      newFiber = currentFiber.newFiber || null;

    // if (fiber.type !== newFiber.type) {
    // }

    return { currentFiber, currentNewFiber };
  };

  // Keep asking for tasks in  free time
  const loopTask = function (dealLine: any) {
    //寻找下一个节点
    while (dealLine.timeRemaining() > 0 && currentFiber) {
      // Incremental rendering
      // if (newRootFiber) {
      // console.log('new ccc');
      // diffrentNode = getNextDiffrentFiber(diffrentNode);
      //给新的虚拟Dom解析链接
      // if (!currentNewFiber.childFiber.dep) {
      //   currentNewFiber = getNextFiber(currentNewFiber);
      // } else if (!currentNewFiber) {
      //   currentNewFiber = newRootFiber;
      //   const nextFiber = getNextDiffrentFiber(currentFiber, currentNewFiber);
      //   currentFiber = nextFiber.currentFiber;
      //   currentNewFiber = nextFiber.currentNewFiber;
      // }
      // } else {
      //   // First apply colours to a drawing
      currentFiber = getNextFiber(currentFiber);
      // }
    }
    //结束任务
    if (!currentFiber && rootFiber) {
      console.log('a');
      commitRoot(rootFiber.childFiber);
    }
    requestIdleCallback(loopTask);
  };

  currentFiber = rootFiber;
  newRootFiber &&
    (diffrentNode = [{ fiber: [rootFiber], newFiber: [newRootFiber] }]);
  requestIdleCallback(loopTask);
};


//新版
export const createVirtalElement = function (
  type: any,
  props: FiberProps,
  ...children: Array<any>
) {
  children = children.map((child) => {
    return typeof child === 'object'
      ? new VNode(child)
      : new VNode({ type: 'TEXT', props: { nodeValue: child } });
  });
  return new VNode({type,props,children});
};


//非链表形式
export const newRender = function (
  container: any,
  virtalDoM: Fiber,
  newVirtalDom: Fiber,
) {
  return new Promise((resolve, reject) => {
    console.log(virtalDoM);
    let currentFiber: DiffrentNode[] = [],
      currentNewFiber: DiffrentNode[] = [],
      diffQueue: DiffrentNode[] = [],
      renderQueue: {
        container: HTMLElement | Text | null;
        vNode: Fiber;
      }[] = [],
      rootFiber: Fiber | null = {
        type: 'root',
        props: {},
        children: [virtalDoM],
        element: container,
      };

    let text = 1;

    // Process the current node and submit the next task
    const getNextFiber = function () {
      if (text > 2) return;

      //没有队列则结束
      if (!diffQueue.length) {
        return;
      }

      let fiberList = diffQueue[0].fiber,
        newFiberList = diffQueue[0].newFiber;
      console.log(fiberList, newFiberList);

      // if (text > 1) {
      //   text++;
      //   return
      // }
      let oldStartIndex = 0,
        newStartIndex = 0,
        oldEndIndex = fiberList.length - 1,
        newEndIndex = newFiberList.length - 1;
      let oldStartNode = fiberList[0],
        oldEndNode = fiberList[oldEndIndex],
        newStartNode = newFiberList[0],
        newEndNode = newFiberList[newEndIndex];
      let idxInOld, oldNodeMap;

      while (newStartIndex <= newEndIndex) {
        console.log(newStartNode, 'nn');
        // if (!oldStartNode) {
        //   oldStartNode = fiberList[++oldStartIndex];
        // } else if (!oldEndNode) {
        //   oldEndNode = fiberList[--oldEndIndex];
        // } else
        if (
          isSameNode(oldStartNode, newStartNode) &&
          newStartNode &&
          oldStartNode
        ) {
          //头头相同
          oldStartNode = pathTask(oldStartNode, newStartNode);
          pathChildren(oldStartNode, newStartNode,diffQueue);
          // if (oldStartNode.children) {
          //   diffQueue.push({
          //     fiber: oldStartNode.children,
          //     newFiber: newStartNode.children || [],
          //   });
          // }
          oldStartNode = fiberList[++oldStartIndex];
          newStartNode = newFiberList[++newStartIndex];
        } else if (
          isSameNode(oldEndNode, newEndNode) &&
          newEndNode &&
          oldStartNode
        ) {
          //尾尾相同
          oldEndNode = pathTask(oldEndNode, newEndNode);
          pathChildren(oldEndNode, newEndNode, diffQueue);
          // if (oldEndNode.children) {
          //   diffQueue.push({
          //     fiber: oldEndNode.children,
          //     newFiber: newEndNode.children || [],
          //   });
          // }
          oldEndNode = fiberList[--oldEndIndex];
          newEndNode = newFiberList[--newEndIndex];
        } else if (
          isSameNode(oldStartNode, newEndNode) &&
          newEndNode &&
          oldStartNode
        ) {
          //头尾相同
          oldStartNode = pathTask(oldStartNode, newEndNode);
          pathChildren(oldStartNode, newEndNode, diffQueue);
          // if (oldStartNode.children) {
          //   diffQueue.push({
          //     fiber: oldStartNode.children,
          //     newFiber: newEndNode.children || [],
          //   });
          // }
          oldStartNode = fiberList[++oldStartIndex];
          newEndNode = newFiberList[--newEndIndex];
        } else if (
          isSameNode(oldEndNode, newStartNode) &&
          newStartNode &&
          oldStartNode
        ) {
          //尾头相同
          oldEndNode = pathTask(oldEndNode, newStartNode);
          pathChildren(oldEndNode, newStartNode, diffQueue);
          // if (oldEndNode.children) {
          //   diffQueue.push({
          //     fiber: oldEndNode.children,
          //     newFiber: newStartNode.children || [],
          //   });
          // }
          oldEndNode = fiberList[--oldEndIndex];
          newStartNode = newFiberList[++newStartIndex];
        } else {
          console.log(oldStartNode, newStartNode);
          //创建剩下的旧元素的map映射
          if (!oldNodeMap) {
            oldNodeMap = creatNodeMap(fiberList, oldStartIndex, oldEndIndex);
          }
          //是否有key
          const key = newStartNode?.key;
          if (key) {
            if (oldNodeMap[key]) {
              oldNodeMap[key].action = 'remove';
              idxInOld = { ...oldNodeMap[key], action: 'insert' };
            }
          } else if (newStartNode) {
            let oldi = findNode(
              newStartNode,
              fiberList,
              oldStartIndex,
              oldEndIndex,
            );
            if (oldi) {
              fiberList[oldi]['action'] = 'remove';
              idxInOld = {
                ...fiberList[oldi],
                children: newStartNode.children,
                action: 'insert',
              };
              pathChildren(fiberList[oldi], newStartNode, diffQueue);
              // diffQueue.push({
              //   fiber: fiberList[oldi].children || [],
              //   newFiber: newStartNode.children || [],
              // });
            }
          }

          if (!idxInOld) {
            if (newStartNode) {
              //如果没有就新增
              newStartNode.action = 'insert';
              fiberList.splice(oldStartIndex - 1, 0, newStartNode);
            }
          } else {
            fiberList.splice(oldStartIndex - 1, 0, idxInOld);
          }
          idxInOld = '';
          oldEndNode = fiberList[++oldEndIndex];
          oldStartNode = fiberList[++oldStartIndex];
          newStartNode = newFiberList[++newStartIndex];
        }
      }

      //增加元素
      if (oldStartIndex > oldEndIndex) {
        for (let i = newStartIndex; i < newEndIndex; i++) {
          const item: Fiber = { ...newFiberList[i], action: 'add' };
          fiberList.splice(oldEndIndex, 0, item);
          oldEndIndex++;
        }
      } else if (newStartIndex > newEndIndex) {
      }
      diffQueue.shift();
      console.log(
        oldStartIndex,
        oldEndIndex,
        newStartIndex,
        newEndIndex,
        diffQueue,
        'fff',
      );
      text++;

      // if (fiber.childFiber && !fiber.childFiber.action) {
      //   // console.log(rootFiber, 'c');
      //   return fiber.childFiber;
      // } else if (fiber.siblingFiber && !fiber.siblingFiber.action) {
      //   // console.log(fiber, 'b');
      //   return fiber.siblingFiber;
      // } else {
      //   // console.log(fiber, 'p');
      //   return fiber.parentFiber || null;
      // }
    };

    const getNextRender = function () {
      if (!renderQueue.length) {
        return;
      }
      const task = renderQueue[0];
      const parentEl = task.container,
        vNode = task.vNode;
      if (vNode.action === 'add') {
        vNode.element = createDom(vNode);
        vNode.element && parentEl && parentEl.appendChild(vNode.element);
      }
      renderQueue.shift();
      if (vNode.children) {
        vNode.element && childToTask(vNode.element, vNode.children);
      }
      if (!renderQueue.length) {
        resolve(rootFiber?.children);
        rootFiber = null;
      }
    };

    const childToTask = function (
      parentEl: HTMLElement | Text | null,
      childrens: Fiber[],
    ) {
      if (!parentEl) {
        return;
      }
      const len = childrens.length || 0;
      for (let i = 0; i < len; i++) {
        renderQueue.push({ container: parentEl, vNode: childrens[i] });
      }
    };

    /** 分解成任务 */
    const pathTask = function (
      // parentEl: HTMLElement,
      vNode: Fiber,
      newVNode: Fiber,
    ) {
      //如果新目标没有则为删除

      // console.log(vNode, newVNode, 'ccc');

      //相同则返回vNode
      if (vNode === newVNode) {
        return vNode;
      }

      //如果为文本类型,文本不一致
      if (vNode.type === 'TEXT' && newVNode.type === 'TEXT') {
        if (vNode.props.nodeValue !== newVNode.props.nodeValue) {
          newVNode.action = 'replace';
          return newVNode;
        }
      }

      //类型不一致则删除重建
      if (vNode.type !== newVNode?.type || vNode.type !== newVNode?.type) {
        return { ...newVNode, children: vNode.children };
      }

      //如果props不相同则替换
      if (vNode.props !== newVNode?.props) {
        vNode.props = newVNode.props;
        vNode.action = 'update';
      }

      return vNode;
    };

    // Keep asking for tasks in  free time
    const loopTask = function (dealLine: any) {
      //寻找下一个节点
      while (dealLine.timeRemaining() > 0 && diffQueue.length) {
        getNextFiber();
      }
      //结束任务,开始渲染
      if (!diffQueue.length) {
        //currentFiber.length && !currentNewFiber.length
        //分解子任务
        if (rootFiber && rootFiber.children && !renderQueue.length) {
          rootFiber.element &&
            childToTask(rootFiber.element, rootFiber.children || [,]);
          console.log(renderQueue, 'jj');
        }

        if (renderQueue.length) {
          console.log('b');
          getNextRender();
        }
        // if (!currentRenderFiber && rootFiber) {
        //   currentRenderFiber = {
        //     parentDom: rootFiber.element,
        //     list: rootFiber.children,
        //   };
        // }
        // commitRoot(rootFiber.children || [], rootFiber.element);
      }
      requestIdleCallback(loopTask);
    };

    diffQueue = [{ fiber: [virtalDoM], newFiber: [newVirtalDom] }];
    requestIdleCallback(loopTask);
  });
};

/** 是否复用节点 */
const isSameNode = function (node: Fiber, newNode: Fiber) {
  console.log(node, newNode, 'njnj');
  return node.key === newNode.key;
  // return true;
  // return (
  //   // (node.key && newNode.key ) ||
  //   (node.type === newNode.type &&
  //     ((node.props && newNode.props) || (!node.props && !newNode.props)))
  // );
};

/** 为旧节创建映射 */
const creatNodeMap = function (list: Fiber[], start: number, end: number) {
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
  node: Fiber,
  list: Fiber[],
  start: number,
  end: number,
) {
  for (let i = start; i < end; i++) {
    const item = list[i];
    if (node && isSameNode(node, item)) {
      return i;
    }
  }
};

/** 对比有无子元素 */
const pathChildren = (a: Fiber, b: Fiber, list: DiffrentNode[]) => {
  if (a.children && b.children) {
    list.push({
      fiber: a.children,
      newFiber: b.children,
    });
  } else if (a.children && !b.children) {
    a.children = undefined;
  } else if (!a.children && b.children) {
    a.children = b.children;
  }
};
/** 判断是否为相似的输入框 */
// const sameInputType =  function(node:any, newNode:any) {
//   if (node.type !== 'input') return true;
//   let i;
//   const typeA = (i = node.props)  && i.type;
//   const typeB = (i = node.props)  && i.type;
//   return typeA === typeB;
// }
export default createElement;
