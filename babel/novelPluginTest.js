const ts = require('typescript');
const { nodes } = require('@babel/generator/lib/node/whitespace');
const walk = require('estree-walker').walk;

const source = `class A  extends HTMLElement {
  @Prop() b:string = 'c';
  @Prop() d:string = 'c';
  @Prop() e:string = 'c';
  a:string = 'd';

  aa(){
    const {b,c} = this,a="c";


    this.b = "c";
    console.log(this.b,'this.b');
    if(a>0){
      this.b = "k";
    }
    function A(){
      this.b = "n";
    }
    const bv = ()=>{
      this.b = 'v';
    }
    this.a = "g"
  }
}`;

//
// "plugins": [
//   ["@babel/plugin-transform-runtime", { "regenerator": true } ],
//   ["@babel/plugin-proposal-decorators", { "legacy": true }],
//   ["@babel/plugin-proposal-class-properties", { "loose": false }],
//   "./babel/index.js"
// ]
// 这是一个自定义转换器
function createTransformer() {
  const extendsClass = 'HTMLElement';
  const PropNames = ['Prop', 'State'];
  return (context) => {
    // console.log(context,'c');
    return (node) => ts.visitNode(node, visit);

    function visit(node) {
      //判断是否为类
      if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        //判断是否为继承
        const heritageClauses = node.heritageClauses || [];
        let isExtendsHtmlElement = false,
          herLen = heritageClauses.length;
        // console.log(heritageClauses,herLen);
        for (let i = 0; i < herLen; i++) {
          const typeItem = heritageClauses[i].types || [];
          const isExtends = typeItem.filter((t) => {
            ////判断是否有继承自HTMLElement
            // console.log(t.expression,'f');
            return (
              t.kind === ts.SyntaxKind.ExpressionWithTypeArguments &&
              t.expression?.escapedText === extendsClass
            );
          });

          // console.log(isExtends,typeItem,'isExtends');

          if (isExtends && isExtends.length) {
            isExtendsHtmlElement = true;
            break;
          }
        }

        //如若不为指定类则跳过
        if (!isExtendsHtmlElement) {
          return ts.visitEachChild(node, visit, context);
        }

        //Members
        const members = node.members || [],
          propertyNames = [];

        members.forEach((n) => {
          if (n.kind === ts.SyntaxKind.PropertyDeclaration) {
            const decorators = n.decorators || [];
            decorators.forEach((d) => {
              const decorationName =
                d.expression?.expression?.escapedText || '';
              if (PropNames.includes(decorationName)) {
                propertyNames.push(n.name.escapedText);
              }
            });
          } else {
            ts.forEachChildRecursively(n, (nodes) => {
              if (nodes.kind === ts.SyntaxKind.ThisKeyword) {
                const parent = nodes.parent;
                console.log(parent.kind, 'k');

                if (parent.kind === ts.SyntaxKind.PropertyAccessExpression) {
                  //子属性赋值,this.xxx.xxx ,console.log(this.xx)
                  const name = parent.name.escapedText;
                  if (propertyNames.includes(name)) {
                    parent.expression = ts.createPropertyAccess(
                      ts.createThis(),
                      ts.createIdentifier(name),
                    );
                    parent.name = ts.createIdentifier('value');
                  }
                  // console.log(name,'name');
                } else if (parent.kind === ts.SyntaxKind.VariableDeclaration) {
                  //函数赋值,防止ES6解耦,const {x} = this
                  const declarations = parent?.parent?.declarations || [];
                  let names = parent?.name?.elements || [],
                    currentDeclaraIndex = -1;
                  let currentNames = names.map((current, index) => {
                    if (propertyNames.includes(current.name.escapedText)) {
                      names.splice(index, 1);
                      return current;
                    }
                  });
                  const elements = currentNames.map((current) => {
                    return ts.createVariableDeclaration(
                      current.name.escapedText,
                      undefined,
                      ts.createPropertyAccess(
                        ts.createPropertyAccess(
                          ts.createThis(),
                          ts.createIdentifier(current.name.escapedText),
                        ),
                        ts.createIdentifier('value'),
                      ),
                    );
                  });
                  if (elements.length) {
                    declarations.map((current, index) => {
                      if (current.transformFlags === parent.transformFlags) {
                        currentDeclaraIndex = index;
                      }
                    });
                    if (currentDeclaraIndex > -1) {
                      declarations.splice(
                        currentDeclaraIndex,
                        names.length ? 0 : 1,
                        ...elements,
                      );
                    }
                  }
                }
              }
            });
          }
        });
      }

      // 其它节点保持不变
      return ts.visitEachChild(node, visit, context);
    }
  };
}

const transformBinaryExpressionLeft = function (expression, name) {
  if (!name?.escapedText) {
    return;
  }

  //只有一层
  if (expression?.kind === ts.SyntaxKind.ThisKeyword) {
    return ts.createPropertyAccess(
      ts.createPropertyAccess(
        ts.createThis(),
        ts.createIdentifier(name?.escapedText),
      ),
      ts.createIdentifier('value'),
    );
    expression = ts.createPropertyAccess(
      ts.createThis(),
      ts.createIdentifier(name?.escapedText),
    );
  } else {
    return ts.createPropertyAccess(
      transformBinaryExpressionLeft(expression.expression, expression.name),
      ts.createIdentifier(name?.escapedText),
    );
  }
};

const walkChildren = function (node, visitor, context, nodesVisitor) {
  if (node.getChildCount() <= 0 && nodes.kind === 236) {
    return;
  }

  // console.log(node.getChildCount());

  const children = node.getChildren();
  children.forEach((c) => {
    visitor(node, context);
    if (c.getChildCount() > 0) {
      walkChildren(c, visitor, context);
    }
  });
  // ts.visitEachChild(
  //   node,
  //   (nodes)=>{
  //     visitor(nodes);
  //     // console.log(nodes.getChildCount());
  //     if(nodes.kind !== 236){
  //       walkChildren(nodes, visitor, context)
  //     }
  //   },
  //   context,
  // );
};

const result = ts.transpileModule(source, {
  transformers: { before: [createTransformer()] },
  compilerOptions: {
    target: 'es6',
  },
});

console.log(result.outputText);
