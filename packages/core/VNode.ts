import { isCustomComponent } from '@/core/element';

export class VNode {
  readonly isCustomTag: boolean = false;
  type: VNodeType = '';
  props: { [k: string]: any } = {};
  key?: VNodeKey;
  element?: VNodeElement;
  children?: VNode[];
  parent?: VNode;
  [k: string]: any;

  constructor(props: VNodeProps) {
    if (!props.type) {
      throw new Error('VNode must have type  !');
    }
    for (let p in props) {
      if (props[p]) {
        this[p] = props[p];
      }
    }
    if (typeof props.type === 'string') {
      this.isCustomTag = isCustomComponent(props.type);
    }
  }
}

export default VNode;
