const ts = require('typescript');

const source = `class A  extends HTMLElement {
  @Prop() b:string = 'c';
  @Prop() d:string = 'c';
  @Prop() e:string = 'c';

  aa(){
    const { et,c } = this,
      d = 'v';
    this.b = "c";
    this.d.e = "F";
  }
}`;
// console.log(ts);

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
          //判断是否为属性
          if (n.kind === ts.SyntaxKind.PropertyDeclaration) {
            const decorators = n.decorators || [];
            decorators.forEach((d) => {
              const decorationName =
                d.expression?.expression?.escapedText || '';
              if (['Prop'].includes(decorationName)) {
                propertyNames.push(n.name.escapedText);
              }
            });
          } else {
            const body = n.body?.statements || [];

            //正常检测This属性
            body.forEach((s) => {
              const expression = s.expression || '';
              console.log(ts.isVariableStatement(s), 'kind');

              //ES6
              if (ts.isVariableStatement(s)) {
                const declarationList = s.declarationList;
                const declarationType = declarationList.flags;
                const declarations = declarationList.declarations || [];
                declarations.map((declaration, dIndex) => {
                  if (
                    declaration.initializer.kind === ts.SyntaxKind.ThisKeyword
                  ) {
                    const elements = declaration.name.elements || [];
                    const newElements = elements.map((element) => {
                      if (element.name?.escapedText) {
                        return ts.createVariableDeclaration(
                          element.name.escapedText,
                          undefined,
                          ts.createPropertyAccess(
                            ts.createPropertyAccess(
                              ts.createThis(),
                              ts.createIdentifier(element.name.escapedText),
                            ),
                            ts.createIdentifier('value'),
                          ),
                        );
                      }
                      // && names.push(element.name?.escapedText)
                    });

                    if (newElements.length) {
                      declarations.splice(dIndex, 1, ...newElements);
                    }
                  }
                });
                console.log(declarations, 'b');
                // console.log(declarationList.flags,'j') //let 1 const 2 var 0
              }

              //判断是否为等式
              if (expression?.kind === ts.SyntaxKind.BinaryExpression) {
                expression.left &&
                  (expression.left = transformBinaryExpressionLeft(
                    expression.left.expression,
                    expression.left.name,
                  ));
              }
            });

            // console.log(body)
          }
        });
      }

      // 其它节点保持不变
      return ts.visitEachChild(node, visit, context);
    }
  };
}

// function transformPlugin(context){
//   function visit(node) {
//     //判断是否为类
//     if(node.kind === ts.SyntaxKind.ClassDeclaration){
//       //判断是否为继承
//       const heritageClauses = node.heritageClauses || [];
//       let isExtendsHtmlElement = false,
//         herLen = heritageClauses.length;
//       // console.log(heritageClauses,herLen);
//       for(let i = 0 ;i<herLen;i++){
//         const  typeItem = heritageClauses[i].types || [];
//         const isExtends = typeItem.filter(t => {
//           ////判断是否有继承自HTMLElement
//           // console.log(t.expression,'f');
//           return t.kind === ts.SyntaxKind.ExpressionWithTypeArguments && t.expression?.escapedText === "HTMLElement";
//         });
//
//         // console.log(isExtends,typeItem,'isExtends');
//
//         if(isExtends && isExtends.length){
//           isExtendsHtmlElement = true;
//           break;
//         }
//       }
//
//       //如若不为指定类则跳过
//       if(!isExtendsHtmlElement){
//         return ts.visitEachChild(node, visit, context);
//       }
//
//       //Members
//       const members = node.members || [],propertyNames = [];
//
//       members.forEach(n=>{
//
//         //判断是否为属性
//         if(n.kind === ts.SyntaxKind.PropertyDeclaration){
//           const decorators = n.decorators || [];
//           decorators.forEach(d=>{
//             const decorationName = d.expression?.expression?.escapedText || "";
//             if(['Prop'].includes(decorationName)){
//               propertyNames.push(n.name.escapedText);
//             }
//           });
//         } else {
//           const body  = n.body?.statements || [];
//           body.forEach(s=>{
//             const expression = s.expression || "";
//             //判断是否为等式
//             if(expression && expression.kind === ts.SyntaxKind.BinaryExpression){
//               expression.left && (expression.left = transformBinaryExpressionLeft(expression.left.expression,expression.left.name));
//             }
//           })
//
//           // console.log(body)
//         }
//       })
//
//
//
//     }
//
//
//     // 其它节点保持不变
//     return ts.visitEachChild(node, visit, context)
//   }
//
//   return node => ts.visitNode(node, visit);
// }

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

const result = ts.transpileModule(source, {
  transformers: { before: [createTransformer()] },
  compilerOptions: {
    target: 'es6',
  },
});

console.log(result.outputText);

// module.exports = transformPlugin ;
