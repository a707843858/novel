import Style from './style/index.scss';
import { Component, CustomComponent, Prop } from '../../core';
import { isNum } from '../utils/utils';

// class BadgeProps {
//   value: string | number = 'gg';
//   max: number = 0;
//   dot: boolean = false;
// }

@Component({
  name: 'n-badge',
  mode: 'closed',
  style: Style.toString(),
})
export class Badge extends CustomComponent {
  @Prop() value: string | number = '';
  @Prop() max: number = 0;
  @Prop() dot: boolean = false;

  constructor() {
    super();
  }

  render() {
    const { value, max, dot } = this;
    const NodeDot = () => {
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
    );
  }

  // updateProps() {
  //   this.value = this.getAttribute('value') || '';
  //   this.max = Number(this.getAttribute('max')) || undefined;
  //   this.dot = ['null', null, false, 'false'].includes(this.getAttribute('dot'))
  //     ? false
  //     : true;
  // }
  // connectedCallback() {
  //   this.updateProps();
  //   this.render();
  // }
  // attributeChangedCallback(name: any, oldValue: any, newValue: any) {
  //   this.updateProps();
  //   this.shadowRootNode.innerHTML = this.render();
  // }
  // static get observedAttributes() {
  //   return ['value', 'max', 'dot'];
  // }
}

export default Badge;
