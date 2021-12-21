/** 判断是否为数字 */
export const isNum = (val: any) => {
  let isNumber = false;
  if (typeof val === 'number') {
    isNumber = true;
  } else if (typeof val === 'string') {
    isNumber = !isNaN(Number(val));
  }
  return isNumber;
};

/** */
export function definedComponent(name: string, context: any) {
  if (customElements) {
    name = name.charAt(0).toLowerCase() + humpToLine(name.substring(1));
    if (!window.customElements.get(`n-${name}`)) {
      window.customElements.define(`n-${name}`, context);
    }
  } else {
    throw Error("Don't support customElements");
  }
}

/** 驼峰转划线 */
export function humpToLine(str: string, separator: string = '-') {
  return str.replace(/([A-Z])/g, `${separator}$1`).toLowerCase();
}
