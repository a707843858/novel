import { Component, Prop, State, NovelElement } from '@/core';
import Style from './style/index.scss';
import classnames from 'classnames';
import { tuple } from '@/component/utils/types';

const RadioTypes = tuple('zoosemy');
const RadioSizeTypes = tuple('large', 'small');
export type RadioType = typeof RadioTypes[number];
export type RadioSizeType = typeof RadioSizeTypes[number];

@Component({
  name: 'n-radio',
  mode: 'closed',
  style: Style.toString(),
})
export default class Radio extends NovelElement {
  @Prop() value?: string | number | readonly string[];
  @Prop() name?: string;
  @Prop() type?: RadioType;
  @Prop() size?: RadioSizeType;
  @State() checked?: string | number | readonly string[];
  @Prop() disabled?: boolean;
  // @Prop() options?: { [k: string]: any }[];
  // @Prop() customRender?: (row: { [k: string]: any }) => {};

  beforeCreate() {
    const { name } = this;
    this.setAttribute('role', 'radio');
    this.setAttribute('tabIndex', '-0');
    name && this.setAttribute('aria-name', name);
  }

  handlerClick() {
    if (this.checked !== this.value && !this.disabled) {
      this.checked = this.checked ? '' : this.value;
    }
  }

  // OptionsNode() {
  //   // return <div>a</div>;
  //   const { options, disabled, name } = this;
  //   const list = options || [{ label: '', value: true }];
  //   const radioNode = list.map((current) => {
  //     return (
  //       <div
  //         className={classnames('n-radio', {
  //           'is-disabled': current.disabled || disabled,
  //         })}
  //       >
  //         <div className="n-radio__input">
  //           <input
  //             type="radio"
  //             className="n-radio__origin"
  //             value={current.value}
  //             autoComplete="off"
  //             aria-hidden="true"
  //             tabIndex={-1}
  //             name={name}
  //           ></input>
  //         </div>
  //         <span className="n-radio__label">{current.label} </span>
  //       </div>
  //     );
  //   });
  //   console.log(radioNode);
  //   return radioNode || '';
  // }

  render() {
    const { value, checked, name, type, size, disabled, $children } = this;
    return (
      <div
        className={classnames(
          'n-radio',
          type && `is-${type}`,
          size && `is-${size}`,
          {
            'is-checked': checked,
            'is-disabled': disabled,
          },
        )}
        onClick={() => this.handlerClick()}
      >
        <div className="n-radio__input">
          <input
            type="radio"
            className="n-radio__origin"
            value={value}
            autoComplete="off"
            aria-hidden="true"
            tabIndex={-1}
            name={name}
          ></input>
        </div>
        <span className="n-radio__label">{$children || <slot />}</span>
      </div>
    );
  }
}

export { Radio };
