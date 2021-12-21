interface vNodeType {
  tag?: any;
  attributes?: Map<any, any>;
  children?: string | any[];
}

interface NodeTree {
  node?: HTMLElement;
  vNode?: vNodeType;
}

export default class NovelElement extends HTMLElement {
  constructor() {
    super();
  }

  render(): JSX.Element | null | undefined {
    return null;
  }

  beforeCreate(): void {}

  created(): void {}
}

export { NovelElement };
