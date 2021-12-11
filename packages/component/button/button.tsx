import Style from './style/index.scss';
import classnames from 'classnames';
// import { Icon } from '../icon';
import { defindComponent } from '../utils/utils';
import { tuple } from '../utils/types';
import { Component, Prop, CustomComponent } from '../../core';

const ButtonThemeTypes = tuple(
  'info',
  'primary',
  'success',
  'warning',
  'danger',
);
const ButtonTypes = tuple('normal', 'link', 'plain', 'dashed');
const ButtonSizeTypes = tuple('large', 'small');
export type ButtonHTMLType = 'submit' | 'button' | 'reset';
export type ButtonThemeType = typeof ButtonThemeTypes[number];
export type ButtonType = typeof ButtonTypes[number];
export type ButtonSizeType = typeof ButtonSizeTypes[number];

@Component({
  name: 'n-button',
  mode: 'closed',
  style: Style.toString(),
})
export class Button extends CustomComponent {
  @Prop() size: ButtonSizeType = '';
  @Prop() color: String = '#E4EBF5';
  // @Prop() type: string = '';
  @Prop() disabled: boolean = false;
  @Prop() loading: boolean = false;
  @Prop() icon: string = '';
  @Prop() zoosemy: boolean = false;
  @Prop() theme: ButtonThemeType = '';
  @Prop() circle: boolean = false;
  @Prop() round: boolean = false;

  render() {
    const { disabled, icon, loading, size, theme, zoosemy, circle, round } =
      this;
    const classNames = classnames(
      'n-button',
      (size && `n-button__${size}`) || '',
      (theme && `n-button__${theme}`) || '',
      (zoosemy && `n-button__zoosemy`) || '',
      {
        'n-button__disabled': disabled,
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
    const NodeButtonWrap = () => {
      if (this.innerHTML) {
        return (
          <span className="n-button_wrapper">
            <slot></slot>
          </span>
        );
      }
      return '';
    };
    return (
      <button disabled={disabled} className={classNames} data-bb="cc">
        {NodeIcon()}
        {NodeButtonWrap()}
      </button>
    );
  }
}

export default Button;
