import {  CustomComponent, defineComponent } from './core';
// import Style from './component/badge/style/index.scss';
import 'reflect-metadata';
import { isNum } from './component/utils/utils';
import { Prop, Component } from './core/decorators/decorators';
// import 'reflect-metadata';

interface vNodeType {
  tag?: any;
  attributes?: Map<any, any>;
  children?: string | any[];
}

interface NodeTree {
  node?: HTMLElement;
  vNode?: vNodeType;
}


class Button extends CustomComponent  {//
  // @Prop() value: string | number = 2;
  // @Prop() max: number = 1 ;
  // @Prop() dot: boolean = false;


  // constructor() {
  //   super();
  // }


  render(): NodeTree {

    console.log(this.cssStyle,'vvvvvvvvvvvv');
    const { value, dot, max } = this;

    const NodeDot = function () {
      if (dot) {
        return <div className="n-badge_dot_content"></div>;
      }
      return '';
    };
    const NodeContext = () => {
      if (![undefined, '', -1].includes(value) && !dot) {
        return (
          <div className="n-badge_content">
            {value && isNum(value) && max && value > max ? `${max}+` : value}
          </div>
        );
      }
      return '';
    };
    return (
      <div className="n-badge">
        {NodeDot()}
        {NodeContext()}
        <slot></slot>
      </div>
    ); //${styleInner}
  }

  // static get observedAttributes() {
  //   return ['value'];
  // }

  // attributeChangedCallback(name: any, oldKey: any, newKey: any) {
  //   console.log(name, oldKey, JSON.parse(newKey));
  // }
};


export const ButtonComponent = defineComponent(
  Button,
  {
    name: 'n-a',
  },
);

// define('n-a',Button);

// if (!window.customElements.get('n-a')) {
//   window.customElements.define('n-a', Button);
// }

export default ButtonComponent;
