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

/** 驼峰转划线 */
export function humpToLine(str: string, separator: string = '-') {
  return str.replace(/([A-Z])/g, `${separator}$1`).toLowerCase();
}

export function camelCaseToHyphen(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
