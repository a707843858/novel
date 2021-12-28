export const componentMap: { [k: string]: any } = {};
export const componentNames: string[] = [];

export const register = function (
  name: string,
  elCtor: CustomElementConstructor,
) {
  if (!name) {
    throw new Error('Component must have tag name !');
  }

  if (customElements.get(name) || componentMap[name]) {
    return false;
  }

  if (customElements) {
    customElements.define(name, elCtor);
    componentMap[name] = elCtor;
    componentNames.push(name);
  }
};

export default { register };
