import { Component, CustomComponent, Prop, State } from '../../core';
import { tuple } from '../utils/types';
import Style from './style/index.scss';
import classnames from 'classnames';

const SwitchSizeTypes = tuple('large', 'small');
export type SwitchSizeType = typeof SwitchSizeTypes[number];

@Component({
  name: 'n-switch',
  mode: 'closed',
  style: Style.toString(),
})
export class Switch extends HTMLElement {
  @Prop() size: SwitchSizeType = '';
  @Prop() value: string | boolean | number = 'l';
  @Prop() checked: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() activeValue: string | number | boolean = true;
  @Prop() inactiveValue: string | number | boolean = false;
  @Prop() zoosemy: boolean = false;
  @State() active: boolean = false;

  beforeCreated() {
    this.active = this.checked;
  }

  handleClick() {
    const { disabled } = this;
    if (!disabled) {
      this.active = !this.active;
      console.log(this.active, 'value');
    }
  }

  render() {
    const { zoosemy, size, active } = this;
    const classNames = classnames('n-switch', (size && `is-${size}`) || '', {
      'is-active': active,
      'is-zoosemy': zoosemy,
    });
    return (
      <div className={classNames} onClick={() => this.handleClick()}>
        <div className="n-switch-dot"></div>
        <input type="checkbox" className="n-switch__input"></input>
        <span className="n-switch-inner">
          {active ? '开' : '关'} {this.value} {active}
        </span>
      </div>
    );
  }
}

export default Switch;
