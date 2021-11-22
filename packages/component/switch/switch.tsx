import { Component, CustomComponent, Prop } from '../../core';
import Style from './style/index.scss';
import classnames from 'classnames';

@Component({
  name: 'n-switch',
  mode: 'closed',
  style: Style.toString(),
})
export class Switch extends CustomComponent {
  @Prop() value: string | boolean | number = false;
  @Prop() checked: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() activeValue: string | number | boolean = true;
  @Prop() inactiveValue: string | number | boolean = false;

  render() {
    const { checked } = this;
    return (
      <div className={classnames('n-switch-wrapper', { active: checked })}>
        <span className ="n-switch-inner">开</span>
      </div>
    );
  }
}

export default Switch;
