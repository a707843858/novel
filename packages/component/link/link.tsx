import { Component, CustomComponent, Prop } from '../../core';
import classnames from 'classnames';
import Style from './style/index.scss';

@Component({
  name: 'n-link',
  mode: 'closed',
  style: Style.toString(),
})
export class Link extends CustomComponent {
  @Prop() href: string = '';
  @Prop() disabled: boolean = false;
  @Prop() icon: string = '';

  render() {
    const { disabled, icon } = this;
    const classNames = classnames('n-link', { 'is-disabled': disabled });
    const NodeIcon = () => {
      if (icon) {
        //@ts-ignore
        return <n-icon className="n-link-icon" name={icon}></n-icon>;
      }
    };
    return (
      <a className={classNames}>
        {NodeIcon()}
        <slot></slot>
      </a>
    );
  }
}

export default Link;
