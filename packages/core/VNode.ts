import component from '@/component';

export type VNodeElement = HTMLElement | Text | null | undefined;
export type VNodeKey = string | number | null;
export type VNodePath =
  | 'add'
  | 'remove'
  | 'replace'
  | 'keep'
  | 'update'
  | 'insert';

export class VNode {
  type: string | Function = '';
  props?: { [k: string]: any };
  key?: VNodeKey;
  element?: VNodeElement;
  children?: VNode[];
  [k: string]: any;

  constructor(props: { [k: string]: any } = {}) {
    if (props) {
      for (let p in props) {
        if (props[p]) {
          this[p] = props[p];
        }
      }
    }
  }

  // setAttribute(key:string,val:any){
  //   const {element} = this;
  //   if(element instanceof  HTMLElement){
  //     element?.setAttribute(key,val);
  //   }else if(element instanceof Text){
  //     element['nodeValue'] = val ;
  //   }
  // }
  //
  // removeAttribute(key:string){
  //   const {element} = this;
  //   if(element instanceof  HTMLElement){
  //     element?.removeAttribute(key);
  //   }else if(element instanceof Text){
  //     element?.parentNode?.removeChild(element)
  //   }
  // }
}

export default VNode;
