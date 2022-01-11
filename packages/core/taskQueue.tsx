import VNode from '@/core/VNode';
import {
  isSameNode,
  creatNodeMap,
  findNode,
  createElement,
  updateProperties,
} from './element';
import { insertBefore } from '@/core/utils';

const elementQueue: ElementQueue = [],
  componentQueue: ComponentQueue = [];
let currentComponent: ComponentQueueItem | null = null;

export function internalLoop(
  callback: (x: any) => void,
  options: any = { timeout: 1000 * 10 },
): any {
  if (typeof requestIdleCallback !== 'undefined') {
    return requestIdleCallback(callback, options);
  } else {
    return setTimeout(callback, options.timeout);
  }
}

export function loopQueue(dealLine: any): void {
  while (dealLine.timeRemaining() > 0 && elementQueue.length) {
    differentElement();
  }

  if (!elementQueue.length) {
    if (currentComponent) {
      currentComponent.callback && currentComponent.callback(true);
      currentComponent = null;
    }
  }

  if (componentQueue.length && !currentComponent) {
    currentComponent = componentQueue[0];
    elementQueue.push({
      container: currentComponent.container,
      oldList: currentComponent.oldDom ? [currentComponent.oldDom] : [],
      newList: currentComponent.newDom ? [currentComponent.newDom] : [],
    });
    componentQueue.shift();
  }
  internalLoop(loopQueue);
}

export function pushComponentQueue(
  target: any,
  container: HTMLElement | ShadowRoot,
  oldDom?: VNode | null,
  newDom?: VNode | null,
  callback?: Function,
) {
  componentQueue.push({
    container,
    oldDom,
    newDom,
    callback,
    target,
  });
  internalLoop(loopQueue);
}

export function differentElement() {
  if (!elementQueue.length) {
    return;
  }

  const { oldList = [], newList = [], container } = elementQueue[0];
  let oldStartIndex = 0,
    oldEndIndex = oldList.length - 1,
    newStartIndex = 0,
    newEndIndex = newList.length - 1;
  let oldStartNode: VNode | undefined = oldList[oldStartIndex],
    oldEndNode: VNode | undefined = oldList[oldEndIndex],
    newStartNode: VNode | undefined = newList[newStartIndex],
    newEndNode: VNode | undefined = newList[newEndIndex],
    matchedNode: VNode | undefined,
    oldNodeMap: { [k: string]: VNode } = {};

  while (newStartIndex <= newEndIndex) {
    if (isSameNode(oldStartNode, newStartNode)) {
      patchElement(
        container,
        oldStartNode,
        newStartNode,
        oldList,
        newStartIndex,
        oldStartIndex,
      );
      oldStartNode = oldList[++oldStartIndex];
      newStartNode = newList[++newStartIndex];
    } else if (isSameNode(oldStartNode, newEndNode)) {
      patchElement(
        container,
        oldStartNode,
        newEndNode,
        oldList,
        newStartIndex,
        oldStartIndex,
      );
      oldStartNode = oldList[++oldStartIndex];
      newEndNode = newList[--newEndIndex];
    } else if (isSameNode(oldEndNode, newStartNode)) {
      patchElement(
        container,
        oldEndNode,
        newStartNode,
        oldList,
        newStartIndex,
        oldEndIndex,
      );
      oldEndNode = oldList[--oldEndIndex];
      newStartNode = newList[++newStartIndex];
    } else if (isSameNode(oldEndNode, newEndNode)) {
      patchElement(
        container,
        oldEndNode,
        newEndNode,
        oldList,
        newEndIndex,
        oldEndIndex,
      );
      oldEndNode = oldList[--oldEndIndex];
      newEndNode = newList[--newEndIndex];
    } else {
      if (!oldNodeMap) {
        oldNodeMap = creatNodeMap(oldList, oldStartIndex, oldEndIndex);
      }
      const nodeKey = newStartNode?.key;
      matchedNode = nodeKey
        ? oldNodeMap[nodeKey]
        : findNode(newStartNode, oldList, oldStartIndex, oldEndIndex);
      if (matchedNode) {
        patchElement(
          container,
          matchedNode,
          newStartNode,
          oldList,
          newStartIndex,
        );
        matchedNode = undefined;
      } else {
        newStartNode.parent = currentComponent?.target.$self;
        patchElement(
          container,
          undefined,
          newStartNode,
          oldList,
          newStartIndex,
        );
      }
      // 如果移动后不删除旧数据则需+1
      // oldEndNode = oldList[++oldEndIndex];
      oldStartNode = oldList[++oldStartIndex];
      newStartNode = newList[++newStartIndex];
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldEndIndex; i >= oldStartIndex; i--) {
      patchElement(container, oldList[i], undefined, oldList, i);
    }
  }

  elementQueue.shift();
}

export function patchElement(
  container: HTMLElement | ShadowRoot,
  oldNode?: VNode,
  newNode?: VNode,
  nodeList: VNode[] = [],
  newIndex: number = -1,
  oldIndex: number = -1,
) {
  if (!oldNode && !newNode) {
    return;
  }

  if (oldNode === newNode) {
    return;
  }

  const preNode = nodeList[newIndex];
  const preEl = (preNode && preNode.element) || undefined;

  if (!oldNode && newNode) {
    newNode.element = createElement(newNode, currentComponent?.target);
    nodeList?.splice(newIndex, 0, newNode);
    insertBefore(container, newNode.element, preEl);
    patchChildren(newNode.element, undefined, newNode.children);
  } else if (oldNode && !newNode) {
    if (oldNode.element) {
      oldNode.element.parentNode?.removeChild(oldNode.element);
    }
    nodeList?.splice(newIndex, 1);
  } else if (oldNode && newNode) {
    if (
      (oldNode.key && newNode.key && oldNode.key === newNode.key) ||
      oldNode.type === newNode.type
    ) {
      oldNode.props = { ...oldNode.props, ...newNode.props };
      updateProperties(oldNode);
      newNode.element = oldNode.element;
      oldNode.element = undefined;
    } else {
      newNode.element = createElement(newNode, currentComponent?.target);
      updateProperties(newNode);
      if (oldNode.element) {
        oldNode.element.parentNode?.removeChild(oldNode.element);
        oldNode.element = undefined;
      }
      if (newNode.element) {
        insertBefore(container, newNode.element, preEl);
      }
    }

    if (newIndex > -1 && oldIndex > -1) {
      nodeList?.splice(newIndex, 0, newNode);
      nodeList?.splice(oldIndex, 1);
      insertBefore(container, newNode.element, preEl);
    }

    patchChildren(oldNode.element, oldNode.children, newNode.children);
  }
}

export function patchChildren(
  parentEl: HTMLElement | Text | undefined,
  old?: VNode[] | null,
  newV?: VNode[] | null,
) {
  if (parentEl instanceof HTMLElement && (old || newV)) {
    elementQueue.push({
      oldList: old || [],
      newList: newV || [],
      container: parentEl,
    });
  }
}

export default {
  internalLoop,
  loopQueue,
  differentElement,
  patchElement,
  patchChildren,
  pushComponentQueue,
};
