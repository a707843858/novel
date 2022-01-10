import Style from './style/index.scss';
import classnames from 'classnames';
import { tuple } from '../utils/types';
import { Component, Prop, NovelElement } from '@/core';

const ButtonSizeTypes = tuple('large', 'small');
const ButtonThemeTypes = tuple(
  'info',
  'primary',
  'success',
  'warning',
  'danger',
);
const ButtonTypes = tuple('normal', 'link', 'plain', 'dashed', 'zoosemy');

export type ButtonThemeType = typeof ButtonThemeTypes[number];
export type ButtonType = typeof ButtonTypes[number];
export type ButtonSizeType = typeof ButtonSizeTypes[number];
export type ButtonNativeType = 'button' | 'submit' | 'reset' | undefined;

@Component({
  name: 'n-button',
  mode: 'closed',
  style: Style.toString(),
})
export class Button extends NovelElement {
  @Prop() size: ButtonSizeType = '';
  @Prop() disabled: boolean = false;
  @Prop() loading: boolean = false;
  @Prop() icon: string = '';
  @Prop() theme: ButtonThemeType = '';
  @Prop() circle: boolean = false;
  @Prop() round: boolean = false;
  @Prop() type: ButtonType = '';
  @Prop() nativeType: ButtonNativeType;

  render() {
    const {
      $children,
      disabled,
      icon,
      loading,
      size,
      theme,
      circle,
      round,
      nativeType,
      type,
    } = this;
    const classNames = classnames(
      'n-button',
      size && `is-${size}`,
      type && `is-${type}`,
      theme && type !== 'zoosemy' && `is-${theme}`,
      {
        'is-disabled': disabled,
        'is-circle': circle,
        'is-round': round,
      },
    );
    const NodeIcon = () => {
      if (icon || loading) {
        return (
          //@ts-ignore
          <n-icon
            name={loading ? 'solid-spinner' : icon}
            animation={loading ? 'animation=spin' : ''}
          >
            {/* @ts-ignore */}
          </n-icon>
        );
      }
      return '';
    };
    return (
      <button disabled={disabled} className={classNames} type={nativeType}>
        {NodeIcon()}
        <span className="n-button_wrapper">{$children || <slot />}</span>
      </button>
    );
  }
}

export default Button;
