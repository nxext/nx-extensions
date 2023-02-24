import {
  Argument,
  CallExpression,
  Identifier,
  MemberExpression,
  ModuleItem,
  NamedImportSpecifier,
  Param,
  TsParameterProperty,
  TsType,
  TsTypeAnnotation,
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
  isParameter,
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

  override visitModuleItems(items: ModuleItem[]): ModuleItem[] {
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

  override visitConstructorParameter(node: Param | TsParameterProperty): Param | TsParameterProperty {
    if (
      (node.decorators?.length &&
        node.decorators.some(
          (dec) =>
            isCallExpression(dec.expression) &&
            isIdentifer(dec.expression.callee) &&
            dec.expression.callee.value === 'Inject'
        )) ||
      (!node.param?.typeAnnotation && !(node as any).pat?.typeAnnotation)
    ) {
      return node;
    } else {
      if (
        !isParameter(node) &&
        node?.param?.typeAnnotation &&
        isTsTypeAnnotation(node.param.typeAnnotation) &&
        isTsTypeReference(node.param?.typeAnnotation?.typeAnnotation) &&
        isIdentifer(node.param?.typeAnnotation?.typeAnnotation.typeName)
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
      } else if (
        isParameter(node) &&
        isTsTypeAnnotation(((node as any)?.pat?.typeAnnotation as TsTypeAnnotation)) &&
        isTsTypeReference(((node as any)?.pat?.typeAnnotation as TsTypeAnnotation)?.typeAnnotation) &&
        isIdentifer(((node as any)?.pat?.typeAnnotation as TsTypeAnnotation)?.typeAnnotation?.typeName)) {
        node.decorators = node.decorators ?? [];
        node.decorators.push({
          type: 'Decorator',
          span: createSpan(),
          expression: createCallExpression(createIdentifer('Inject'), [
            {
              expression: createIdentifer(
                ((node as any).pat.typeAnnotation as TsTypeAnnotation).typeAnnotation.typeName.value
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

  override visitNamedImportSpecifier(
    node: NamedImportSpecifier
  ): NamedImportSpecifier {
    if (!this.hasInjectorImport && node.local.value === 'Inject') {
      this.hasInjectorImport = true;
    }
    return node;
  }

  override visitTsTypes(nodes: TsType[]): TsType[] {
    return nodes;
  }

  override visitTsType(nodes: TsType): TsType {
    return nodes;
  }
}
