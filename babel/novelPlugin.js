const ts = require('typescript');

function transformPlugin(context) {
  const extendsClass = ['NovelElement'];
  const PropNames = ['Prop', 'State'];
  function visit(node) {
    //判断是否为类
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      //判断是否为继承
      const heritageClauses = node.heritageClauses || [];
      let isExtendsHtmlElement = false,
        herLen = heritageClauses.length;

      for (let i = 0; i < herLen; i++) {
        const typeItem = heritageClauses[i].types || [];
        const isExtends = typeItem.filter((t) => {
          //判断是否有继承自HTMLElement
          return (
            t.kind === ts.SyntaxKind.ExpressionWithTypeArguments &&
            extendsClass.includes(t.expression?.escapedText)
          );
        });

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
            const decorationName = d.expression?.expression?.escapedText || '';
            if (PropNames.includes(decorationName)) {
              propertyNames.push(n.name.escapedText);
            }
          });
        } else {
          // console.log(propertyNames,'p');
          ts.forEachChildRecursively(n, (nodes) => {
            if (nodes.kind === ts.SyntaxKind.ThisKeyword) {
              const parent = nodes.parent;

              if (parent.kind === ts.SyntaxKind.PropertyAccessExpression) {
                //子属性赋值
                const name = parent.name.escapedText;
                if (propertyNames.includes(name)) {
                  parent.expression = ts.createPropertyAccess(
                    ts.createThis(),
                    ts.createIdentifier(name),
                  );
                  parent.name = ts.createIdentifier('value');
                }
              } else if (parent.kind === ts.SyntaxKind.VariableDeclaration) {
                //函数赋值,防止ES6解耦,const {x} = this
                const declarations = parent?.parent?.declarations || [];
                let names = parent?.name?.elements || [],
                  currentNames = [],
                  currentDeclaraIndex = -1;
                // console.log(names.length,'p')

                for (let i = names.length - 1; i >= 0; i--) {
                  if (propertyNames.includes(names[i].name.escapedText)) {
                    console.log(i, names[i].name.escapedText, 'k');
                    currentNames.unshift(names[i]);
                    names.splice(i, 1);
                  }
                }
                // console.log(currentNames,'v')
                // let currentNames = names.map((current, index) => {
                //   console.log(index,current.name.escapedText,'k');
                //   if (propertyNames.includes(current.name.escapedText)) {
                //     names.splice(index, 1);
                //     return current;
                //   }
                // });
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

  return (node) => ts.visitNode(node, visit);
}

function transformBinaryExpressionLeft(expression, name) {
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
}

module.exports = transformPlugin;
