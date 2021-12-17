import { Component, Prop, State } from '@/core';
import Style from './style/index.scss';
import classNames from 'classnames';
import { tuple } from '@/component/utils/types';

export interface RadioGroupOptionsItem {
  label: String;
  value?: string | number | readonly string[];
  disabled?: boolean;
}

export type RadioGroupOptions = RadioGroupOptionsItem[];

const RadioSizeTypes = tuple('large', 'small');
export type RadioSizeType = typeof RadioSizeTypes[number];
const RadioTypes = tuple('zoosemy');
export type RadioType = typeof RadioTypes[number];

@Component({
  name: 'n-radio-group',
  mode: 'closed',
  style: Style.toString(),
})
export default class RadioGroup extends HTMLElement {
  @Prop() defaultValue: any;
  @Prop() disabled?: boolean;
  @Prop() name?: string;
  @Prop() options?: RadioGroupOptions;
  @Prop() size?: RadioSizeType;
  @Prop() type?: RadioType;
  @State() value: any;

  render() {
    const { disabled } = this;
    return (
      <div className={classNames('n-radio-group', { 'is-disabled': disabled })}>
        <slot> </slot>
      </div>
    );
  }
}
