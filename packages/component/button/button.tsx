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
const ButtonTypes = tuple('normal', 'text', 'plain', 'dashed');
export type ButtonHTMLType = 'submit' | 'button' | 'reset';
export type ButtonThemeType = typeof ButtonThemeTypes[number];
export type ButtonType = typeof ButtonTypes[number];

@Component({
  name: 'n-button',
  mode: 'closed',
  style: Style.toString(),
})
export class Button extends CustomComponent {
  @Prop() disabled: boolean = false;
  @Prop() loading: boolean = false;
  @Prop() icon: string = '';

  render() {
    const { disabled, icon, loading } = this;
    const classNames = classnames('n-button');
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
      <button disabled={disabled} className={classNames}>
        {NodeIcon()}
        {NodeButtonWrap()}
      </button>
    );
  }
}

export default Button;
