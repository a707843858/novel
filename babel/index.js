const walk = require('estree-walker').walk;
const types = require('@babel/types');

const parametersInsertPlugin = (api) => {
  //
  return {
    visitor: {
      CallExpression(path) {
        // const node = path.node ;
        // console.log(path.node.name)
        // if(node.name === "__decorate"){
        //   console.log(path,'j');
        // }
      },
      FunctionDeclaration(path, state) {
        // if(path.key == 1){
        //  console.log(path.node?.body?.body,'p');
        // }
      },
      ClassDeclaration(path, state) {
        // console.log(path.hub,'p')
        // if(path.node?.superClass?.name !== "HTMLElement"){
        //   path.skip();
        // }

        const body = path.node?.body?.body || [];

        const propertyNames = [];
        walk(body, {
          enter(node, parent, prop, index) {
            // console.log(node.type,node.name);
            //找到类的装饰器
            if (node.type === 'Decorator') {
              const expression = node.expression;
              if (
                expression &&
                ['Prop', 'State'].includes(expression.callee.name)
              ) {
                const name = parent.key.name;
                propertyNames.push(name);
              }
            } else if (
              node.type === 'ThisExpression' &&
              parent &&
              parent.property &&
              parent.property.type === 'Identifier'
            ) {
              const originName = parent.property.name;
              if (propertyNames.includes(originName)) {
                parent.property.name = 'value';
                parent.object = types.memberExpression(
                  types.thisExpression(),
                  types.identifier(originName),
                );
              }
            }
          },
        });
      },
    },
  };
};

module.exports = parametersInsertPlugin;
