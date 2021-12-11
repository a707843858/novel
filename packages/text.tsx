function Prop() {
  return (target: any, key: any) => {
    target[key] = '';
  };
}

class B {}

const C = {
  a: 'b',
  c: 'd',
};

const { a } = C;

class A extends B {
  @Prop() a: any = { a: '2' };
  et: any;
  c: any;

  aa() {
    const { et, c } = this,
      d = 'v';
    const { a } = this;
    this.a = 'c';
  }
}

console.log(A);
