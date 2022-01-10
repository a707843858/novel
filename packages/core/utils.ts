export function insertBefore(
  parentNode: HTMLElement | ShadowRoot,
  newNode?: HTMLElement | null | Text,
  referenceNode?: HTMLElement | null | Text,
) {
  //@ts-ignore
  // console.log(newNode, newNode?.tagName, 'kl');
  if (referenceNode && newNode && parentNode) {
    parentNode.insertBefore(newNode, referenceNode);
  } else if (parentNode && newNode) {
    parentNode.appendChild(newNode);
  }
}

export function camelCaseToHyphen(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
