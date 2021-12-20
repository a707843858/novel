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
  name: 'aa',
  mode: 'closed',
  style: Style.toString(),
})
export default class RadioGroup extends HTMLElement {
  //@ts-ignore
  readonly isRadioGroup: boolean = true;
  @Prop() defaultValue: any = '';
  @Prop() disabled?: boolean;
  @Prop() name?: string;
  @Prop() options?: RadioGroupOptions;
  @Prop() size?: RadioSizeType;
  @Prop() type?: RadioType;
  @State() value: any;

  beforeCreate() {
    this.setAttribute('role', 'radiogroup');
    this.value = this.defaultValue;
    console.log(this.slot);
  }

  render() {
    const { disabled, size, type } = this;
    return (
      <div
        className={classNames(
          'n-radio-group',
          size && `is-${size}`,
          type && `is-${type}`,
          { 'is-disabled': disabled },
        )}
      >
        <slot> </slot>
      </div>
    );
  }
}

export { RadioGroup };
