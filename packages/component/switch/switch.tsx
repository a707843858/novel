import { Component, Prop, State } from '../../core';
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
  @Prop() value: string | number | boolean | null = false;
  @Prop() disabled: boolean = false;
  @Prop() activeValue: string | number | boolean = true;
  @Prop() inactiveValue: string | number | boolean = false;
  @Prop() zoosemy: boolean = false;
  @Prop() activeText: string | number = '';
  @Prop() inactiveText: string | number = '';
  @State() active: boolean = false;

  beforeCreate() {
    const { activeValue, value } = this;
    if (value === activeValue) {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  handleClick() {
    const { disabled } = this;
    if (!disabled) {
      this.active = !this.active;
      console.log(this.active, 'value');
    }
  }

  render() {
    const { zoosemy, size, active, disabled, activeText, inactiveText } = this;
    const classNames = classnames('n-switch', (size && `is-${size}`) || '', {
      'is-checked': active,
      'is-zoosemy': zoosemy,
      'is-disabled': disabled,
    });
    return (
      <div className={classNames} onClick={() => this.handleClick()}>
        <div className="n-switch-dot" />
        <input type="checkbox" className="n-switch__input" />
        <span className="n-switch-inner">
          {active ? activeText : inactiveText}
        </span>
      </div>
    );
  }
}

export default Switch;
