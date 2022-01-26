import {
  Argument,
  CallExpression,
  Identifier,
  MemberExpression,
  ModuleItem,
  NamedImportSpecifier,
  TsParameterProperty,
  TsType,
} from '@swc/core';
import Visitor from '@swc/core/Visitor';
import {
  createIdentifer,
  createImportSpecifier,
  createSpan,
  isCallExpression,
  isIdentifer,
  isImportDeclaration,
  isTsTypeAnnotation,
  isTsTypeReference,
} from 'swc-ast-helpers';

function createCallExpression(
  callee: MemberExpression | Identifier,
  args: Argument[] = []
) {
  const object: CallExpression = {
    type: 'CallExpression',
    span: createSpan(),
    callee,
    arguments: args,
  };
  return object;
}

export class AngularInjector extends Visitor {
  private hasInjectorImport = false;
  private hasInjectedConstructor = false;

  visitModuleItems(items: ModuleItem[]): ModuleItem[] {
    const result = items.flatMap((item) => this.visitModuleItem(item));

    if (!this.hasInjectorImport && this.hasInjectedConstructor) {
      return result.map((res) => {
        if (isImportDeclaration(res)) {
          if (!this.hasInjectorImport && res.source.value === '@angular/core') {
            res.specifiers.push(createImportSpecifier('Inject'));
            this.hasInjectorImport = true;
          }
        }
        return res;
      });
    }
    return result;
  }

  visitConstructorParameter(node: TsParameterProperty): TsParameterProperty {
    if (
      (node.decorators?.length &&
        node.decorators.some(
          (dec) =>
            isCallExpression(dec.expression) &&
            isIdentifer(dec.expression.callee) &&
            dec.expression.callee.value === 'Inject'
        )) ||
      !node.param
    ) {
      return node;
    } else {
      if (
        isTsTypeAnnotation(node.param.typeAnnotation) &&
        isTsTypeReference(node.param.typeAnnotation.typeAnnotation) &&
        isIdentifer(node.param.typeAnnotation.typeAnnotation.typeName)
      ) {
        node.decorators = node.decorators ?? [];
        node.decorators.push({
          type: 'Decorator',
          span: createSpan(),
          expression: createCallExpression(createIdentifer('Inject'), [
            {
              expression: createIdentifer(
                node.param.typeAnnotation.typeAnnotation.typeName.value
              ),
            },
          ]),
        });
        this.hasInjectedConstructor = true;
        return node;
      } else {
        return node;
      }
    }
  }

  visitNamedImportSpecifier(node: NamedImportSpecifier): NamedImportSpecifier {
    if (!this.hasInjectorImport && node.local.value === 'Inject') {
      this.hasInjectorImport = true;
    }
    return node;
  }

  visitTsTypes(nodes: TsType[]): TsType[] {
    return nodes;
  }

  visitTsType(nodes: TsType): TsType {
    return nodes;
  }
}
