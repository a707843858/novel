import 'reflect-metadata';

export function apllyMetaType(
  type:any,
  target: any,
  key: string,
) {
  if (!type) {
    type = Reflect.getMetadata('design:type', target, key);
    if (typeof type !== 'object') {
      type = type;
    }
    return type;
  }
}
