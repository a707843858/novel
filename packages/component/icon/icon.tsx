import classnames from 'classnames';
import { tuple } from '../utils/types';
import { isNum } from '../utils/utils';
import Style from './style/index.scss';
import { Component, CustomComponent, Prop } from '../../core';
import chroma from 'chroma-js';
// import './style/fonts/brands.svg';
// const style = require('./style/index.scss');
// const brands = require('./style/fonts/brands.svg');
// const regular = require('./style/fonts/regular.svg');
// const solid = require('./style/fonts/solid.svg');
// const iconMap: Map<string, any> = new Map();
// const icons: { [k: string]: any } = { regular, brands, solid };
// const reg = /<symbol(.*?)<\/symbol>/g;
// Object.keys(icons).map((key) => {
//   const iconList = icons[key].match(reg);
//   const len = iconList.length;
//   for (let i = 0; i < len; i++) {
//     iconList[i] = iconList[i].replace(/symbol/g, 'svg');
//     const id = iconList[i].match(/id="(.*?)"/)[1];
//     const path = iconList[i].match(/<path(.*?)path>/)[0];
//     // console.log(iconList[i].match(/<path(.*?)path>/)[0], 'p');
//     iconMap.set(`${key !== 'regular' ? key + '-' : ''}${id}`, iconList[i]);
//   }
// });
// console.log(Style[0][1],Style.toString());

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
  readonly version: string = '5.15.3';
  @Prop() name: string = '';
  @Prop() animation?: IconAnimationType;
  @Prop() color?: string = 'inherit';
  @Prop() size?: string | number = 20;

  render() {
    const { name, size, color = 'inherit' } = this;
    const nameList = (name && name.split('_')) || [];
    const iconMap = new Map();
    let textShadow: string = '';
    const classNames = classnames(
      'n-icon',
      nameList[1] ? `fa-${nameList[1]}` : 'fa-solid',
      nameList[0] ? `fa-${nameList[0]}` : '',
    );
    if (color && color !== 'inherit') {
      console.log(chroma(color).rgba());
      textShadow = `0 0 2px ${chroma(color).alpha(0.7)}`;
    }
    const sizeStr = size && isNum(size) ? `${size}px` : size;
    return (
      <i
        className={classNames}
        style={{ fontSize: sizeStr, color, textShadow }}
      ></i>
    );
    // return (
    //   <div
    //     className={classNames}
    //     style={{ fontSize: sizeStr ,color:color}}
    //     //@ts-ignore
    //     innerHTML={inner}
    //   >
    //     {/* {inner} */}
    //   </div>
    // );
  }
}

customElements.define('n-icon', Icon);

export default Icon;
