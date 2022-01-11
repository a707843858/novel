import { Component, Prop, State, NovelElement } from '@/core';
import Style from './style/index.scss';
import classNames from 'classnames';
import { tuple } from '@/component/utils/types';
import VNode from '@/core/VNode';

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
export default class RadioGroup extends NovelElement {
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
  }

  formatRadio(
    child: null | undefined | (VNode | string)[],
  ): undefined | null | (VNode | string)[] {
    const { size, disabled, type, name } = this;
    if (child) {
      child.map((item) => {
        if (item instanceof VNode && item.type === 'n-radio') {
          item.props = item.props || {};
          item.props = {
            ...item.props,
            type,
            size,
            name,
            disabled: disabled || item.disabled,
          };

          if (item.children) {
            //@ts-ignore
            item.children = this.formatRadio(item.children);
          }
        }
        return item;
      });
      // const childLen = child.length;
      // console.log(child.length);
      // for (let i = 0; i < childLen; i++) {
      //   const item = child[i];
      //   console.log(item, 'k');
      //   if (item instanceof VNode && item.type === 'n-radio') {
      //     item.props = item.props || {};
      //     item.props = {
      //       ...item.props,
      //       type,
      //       size,
      //       name,
      //       disabled: disabled || item.disabled,
      //     };
      //
      //     if (item.children) {
      //       this.formatRadio(item.children);
      //     }
      //   }
      // }
    }
    return child;
  }

  render() {
    this.$children = this.formatRadio(this.$children);
    const { disabled, size, type, $children } = this;
    console.log($children, this.isInstalled, '$children');
    return (
      <div
        className={classNames(
          'n-radio-group',
          size && `is-${size}`,
          type && `is-${type}`,
          { 'is-disabled': disabled },
        )}
      >
        {$children || <slot />}
      </div>
    );
  }
}

export { RadioGroup };
