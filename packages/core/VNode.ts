import { isCustomComponent } from '@/core/element';
import { componentNames } from '@/core/register';

let VNodeUid: number = 1;

export class VNode {
  readonly uid: number = VNodeUid++;
  readonly isCustomTag: boolean = false;
  readonly isNovelElement: boolean = false;
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

    if (typeof props.type === 'string' && componentNames.includes(props.type)) {
      this.isNovelElement = true;
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
