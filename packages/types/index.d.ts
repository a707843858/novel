declare namespace Novel {
  const creatElement: Function;
}
declare interface Window {
  requestIdleCallback(callback: void, option: { [k: string]: any }): void;
}
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {
    node: HTMLElement;
  }
}
declare interface CSSStyleSheet {
  replaceSync(css:string):void;
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
