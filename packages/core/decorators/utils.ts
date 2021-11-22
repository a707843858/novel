export function readonly(): MethodDecorator {
  return (Object: any, key: string | symbol, descriptor: any) => {
    descriptor.writable = false;
    return descriptor;
  };
}
