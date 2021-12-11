export type VNodeElement = HTMLElement | Text | null;
export type VNodeKey = string | number | null;
export type VNodePath =
  | 'add'
  | 'remove'
  | 'replace'
  | 'keep'
  | 'update'
  | 'insert';

export class VNodeProps {
  type: string = '';
  props?: { [k: string]: any };
  key?: VNodeKey;
  element?: VNodeElement;
  children?: VNode[];
  patch?: VNodePath;
  [k: string]: any;
}

type T = keyof VNodeProps;

export default class VNode {
  [x: string]: VNodeProps[T];

  constructor(props?: VNodeProps) {
    if (props) {
      for (let p in props) {
        if (props[p]) {
          this[p] = props[p];
        }
      }
    }
  }
}
