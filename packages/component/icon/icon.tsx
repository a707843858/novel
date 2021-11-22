import classnames from 'classnames';
import { tuple } from '../utils/types';
import { isNum } from '../utils/utils';
import Style from './style/index.scss';
import { Component, CustomComponent, Prop } from '../../core';
import './style/fonts/brands.svg';

// const style = require('./style/index.scss');
const brands = require('./style/fonts/brands.svg');
const regular = require('./style/fonts/regular.svg');
const solid = require('./style/fonts/solid.svg');
const iconMap: Map<string, any> = new Map();
const icons: { [k: string]: any } = { regular, brands, solid };
const reg = /<symbol(.*?)<\/symbol>/g;
Object.keys(icons).map((key) => {
  const iconList = icons[key].match(reg);
  const len = iconList.length;
  for (let i = 0; i < len; i++) {
    iconList[i] = iconList[i].replace(/symbol/g, 'svg');
    const id = iconList[i].match(/id="(.*?)"/)[1];
    iconMap.set(`${key !== 'regular' ? key + '-' : ''}${id}`, iconList[i]);
  }
});

const IconRotateTypes = tuple('horizontal', 'vertical', 'both', 90, 180, 270);
const IconAnimationTypes = tuple('spin', 'pulse');
export type IconRotateType = typeof IconRotateTypes[number];
export type IconAnimationType = typeof IconAnimationTypes[number];

@Component({
  name: 'n-icon',
  mode: 'closed',
  style: Style.toString(),
})
export class Icon extends CustomComponent {
  version: string = '5.15.3';
  @Prop() name: string = '';
  @Prop() animation?: IconAnimationType;
  @Prop() color?: string = 'inherit';
  @Prop() path?: string;
  @Prop() size?: string | number = 20;
  @Prop() view?: number;

  render() {
    const { name, path, size, color = 'inherit', view } = this;
    const classNames = classnames('n-icon');
    const sizeStr = size && isNum(size) ? `${size}px` : size;
    const inner = path ? (
      <path d={path}></path>
    ) : (
      (name && iconMap.get(name)) || ''
    );
    return (
      <svg
        className={classNames}
        style={{ fontSize: sizeStr, color: color }}
        viewBox={path ? `0 0 ${view} ${view}` : ''}
        //@ts-ignore
        innerHTML={inner}
      >
        {/* {inner} */}
      </svg>
    );
  }
}

customElements.define('n-icon', Icon);

export default Icon;
