export interface FiberProps {
  [k: string]: any;
  children?: any[] | null;
}

export const createElement = function (
  type: any,
  props: FiberProps,
  ...children: Array<any>
) {
  console.log(type, props, children);
  let el: HTMLElement;
  //elment
  if (typeof type === 'string') {
    el = creatElement(type);
  };

  //props
  if (props) {
    Object.keys(props).map((prop) => {
      console.log(prop);
    });
  }

  // //设置元素
  // children = children.map((child) => {
  //   return typeof child === 'object' ? child : createTextElement(child);
  // });
  return { type, props: { ...props, children } };
};
