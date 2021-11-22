export const tuple = <T extends any[]>(...args: T) => args;

const ButtonSizeTypes = tuple('small', 'mini', 'medium', 'large', 'big', 'huge');
export  type ButtonSizeType = typeof ButtonSizeTypes[number];
