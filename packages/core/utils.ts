export function insertBefore(
  parentNode: HTMLElement,
  newNode?: HTMLElement,
  referenceNode?: HTMLElement | null,
) {
  if (referenceNode && newNode && parentNode) {
    parentNode.insertBefore(newNode, referenceNode);
  } else if (parentNode && newNode) {
    parentNode.appendChild(newNode);
  }
}
