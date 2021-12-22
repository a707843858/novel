import { Component, Prop, State } from '@/core';
import { tuple } from '../utils/types';
import Style from './style/index.scss';
import classnames from 'classnames';
import { NovelElement } from '@/core';

const SwitchSizeTypes = tuple('large', 'small');
export type SwitchSizeType = typeof SwitchSizeTypes[number];
const SwitchTypes = tuple('zoosemy');
export type SwitchType = typeof SwitchTypes[number];

@Component({
  name: 'n-switch',
  mode: 'closed',
  style: Style.toString(),
})
export class Switch extends NovelElement {
  @Prop() size: SwitchSizeType = '';
  @Prop() value: string | number | boolean | null = false;
  @Prop() disabled: boolean = false;
  @Prop() activeValue: string | number | boolean = true;
  @Prop() inactiveValue: string | number | boolean = false;
  @Prop() type: SwitchType = '';
  @Prop() activeText: string | number = '';
  @Prop() inactiveText: string | number = '';
  @State() active: boolean = false;

  // constructor() {
  //   super(Switch);
  // }

  beforeCreate() {
    const { activeValue, value } = this;
    this.active = value === activeValue;
  }

  handleClick() {
    const { disabled } = this;
    if (!disabled) {
      this.active = !this.active;
      console.log(this.active, 'value');
    }
  }

  render() {
    const { type, size, active, disabled, activeText, inactiveText } = this;
    const classNames = classnames(
      'n-switch',
      (size && `is-${size}`) || '',
      type && `is-${type}`,
      {
        'is-checked': active,
        'is-disabled': disabled,
      },
    );
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
