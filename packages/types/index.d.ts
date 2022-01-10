// declare namespace Novel {
//   const creatElement: Function;
// }

declare interface Window {
  requestIdleCallback(callback: void, option: { [k: string]: any }): void;
}
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {
    node: HTMLElement;
  }
}
declare interface CSSStyleSheet {
  replaceSync(css: string): void;
}
declare interface ShadowRoot {
  adoptedStyleSheets: CSSStyleSheet[];
}
declare const creatElement: Function;

declare module '*.scss' {
  const content: any;
  export default content;
}
declare module '*.css' {
  const content: any;
  export default content;
}

//VNode

type VNodeElement = HTMLElement | Text;
type VNodeKey = string | number | null;
type VNodeType = string | Function;
interface VNodeProps {
  type: VNodeType;
  props?: { [k: string]: any };
  children?: VNode[];

  [k: string]: any;
}

declare class VNode {
  [k: string]: any;
  isCustomTag: boolean;
  type: VNodeType;
  props: { [k: string]: any };
  key?: VNodeKey;
  element?: VNodeElement;
  children?: VNode[];
  constructor(props?: VNodeProps);
}

//taskQueue
interface ElementQueueItem {
  oldList?: VNode[];
  newList?: VNode[];
  container: HTMLElement | ShadowRoot;
}
interface ComponentQueueItem {
  target: any;
  container: HTMLElement | ShadowRoot;
  oldDom?: VNode | null;
  newDom?: VNode | null;
  callback?: Function;
}
type ElementQueue = ElementQueueItem[];
type ComponentQueue = ComponentQueueItem[];
