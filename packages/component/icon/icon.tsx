import classnames from 'classnames';
import { tuple } from '../utils/types';
import { isNum } from '../utils/utils';
import Style from './style/index.scss';
import { Component, NovelElement, Prop } from '@/core';
import chroma from 'chroma-js';

const IconRotateTypes = tuple('horizontal', 'vertical', 'both', 90, 180, 270);
const IconAnimationTypes = tuple('beat', 'fade', 'beat-fade', 'flip', 'spin');
export type IconRotateType = typeof IconRotateTypes[number];
export type IconAnimationType = typeof IconAnimationTypes[number];

@Component({
  name: 'n-icon',
  mode: 'closed',
  style: Style.toString(),
})
export class Icon extends NovelElement {
  readonly version: string = '6.0.0-beta3-free';
  @Prop() name: string = '';
  @Prop() animation?: IconAnimationType;
  @Prop() color?: string = 'inherit';
  @Prop() size?: string | number = 20;

  render() {
    const { name, size, color = 'inherit', animation } = this;
    const nameList = (name && name.split('_')) || [];
    const iconMap = new Map();
    let textShadow: string = '';
    const classNames = classnames(
      'n-icon',
      nameList[1] ? `fa-${nameList[1]}` : 'fa-solid',
      nameList[0] ? `fa-${nameList[0]}` : '',
      animation && `fa-${animation}`,
    );
    if (color && color !== 'inherit') {
      console.log(chroma(color).rgba());
      textShadow = `0 0 2px ${chroma(color).alpha(0.7)}`;
    }
    const sizeStr = size && isNum(size) ? `${size}px` : size;
    const style = { fontSize: sizeStr, color, textShadow };
    return <i className={classNames} style={style}></i>;
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
