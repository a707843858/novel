import Style from './style/index.scss';
import { Component, Prop } from '@/core';
import { isNum } from '../utils/utils';
import { tuple } from '@/component/utils/types';
import classnames from 'classnames';

const BadgeTypes = tuple('zoosemy');
const BadgeThemes = tuple('danger', 'success', 'info', 'warning', '');
export type BadgeType = typeof BadgeTypes[number];
export type BadgeTheme = typeof BadgeThemes[number];

@Component({
  name: 'n-badge',
  mode: 'closed',
  style: Style.toString(),
})
export class Badge extends HTMLElement {
  @Prop() type?: BadgeType;
  @Prop() theme: BadgeTheme = 'danger';
  @Prop() value?: number | string;
  @Prop() max: number = 0;
  @Prop() dot?: boolean;
  @Prop() zoosemy?: boolean;

  render() {
    const { value, max, dot, theme, type } = this;
    const classNames = classnames(
      'n-badge',
      type && `is-${type}`,
      type !== 'zoosemy' && theme && `is-${theme}`,
    );
    const NodeDot = () => {
      return dot ? <div className="n-badge_dot_content"> </div> : '';
    };
    const NodeContext = () => {
      if (value && !dot) {
        const isNumVal = isNum(value);
        return (
          <div className="n-badge_content">
            {isNumVal && max && value > max ? `${max}+` : value}
          </div>
        );
      }
      return '';
    };
    return (
      <div className={classNames}>
        {NodeDot()}
        {NodeContext()}
        <slot> </slot>
      </div>
    );
  }
}

export default Badge;
