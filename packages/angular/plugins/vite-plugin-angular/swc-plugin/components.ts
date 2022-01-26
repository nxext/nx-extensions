import {
  Decorator,
  CallExpression,
  Identifier,
  ObjectExpression,
  KeyValueProperty,
  TsType,
  ArrayExpression,
  StringLiteral,
  ModuleItem,
  Module,
} from '@swc/core';
import { Visitor } from '@swc/core/Visitor.js';
import {
  createArrayExpression,
  createExpressionStatement,
  createIdentifer,
  createStringLiteral,
} from 'swc-ast-helpers';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';

export class AngularComponents extends Visitor {
  private missingImport: string[] = [];
  private importDefaultCount = 1;
  constructor(private sourceUrl: string) {
    super();
  }

  // visitModuleItems(items: ModuleItem[]): ModuleItem[] {
  //   debugger;
  //   return items;
  // }

  // visitModule(m: Module): Module {
  //   debugger;
  //   return m;
  // }

  visitDecorator(decorator: Decorator) {
    if (
      decorator.expression.type === 'CallExpression' &&
      (
        (decorator.expression as unknown as CallExpression)
          ?.callee as Identifier
      ).value === 'Component'
    ) {
      return {
        ...decorator,
        expression: {
          ...(decorator.expression as CallExpression),
          arguments: (decorator.expression as CallExpression).arguments.map(
            (arg) => {
              return {
                ...arg,
                expression: {
                  ...arg.expression,
                  properties: (
                    arg.expression as ObjectExpression
                  ).properties.map((prop: KeyValueProperty) => {
                    if ((prop.key as Identifier).value === 'templateUrl') {
                      const tmplName = `template${this.importDefaultCount}`;
                      this.importDefaultCount += 1;
                      this.missingImport.push(
                        `import ${tmplName} from '${
                          (prop.value as Identifier).value
                        }?raw'`
                      );
                      return {
                        ...prop,
                        key: {
                          ...prop.key,
                          value: 'template',
                        },
                        value: {
                          ...prop.value,
                          type: 'Identifier',
                          value: tmplName,
                        },
                      };
                    }

                    if ((prop.key as Identifier).value === 'styleUrls') {
                      const contents = (
                        prop.value as ArrayExpression
                      ).elements.map((el) => {
                        this.importDefaultCount += 1;
                        const actualImportPath = join(
                          dirname(this.sourceUrl),
                          (el.expression as StringLiteral).value
                        );
                        return readFileSync(actualImportPath, 'utf8');
                      });
                      return {
                        ...prop,
                        key: createIdentifer('styles'),
                        value: createArrayExpression(
                          contents.map((c) =>
                            createExpressionStatement(createStringLiteral(c))
                          )
                        ),
                      };
                    }
                    return prop;
                  }),
                } as ObjectExpression,
              };
            }
          ),
        },
      };
    }
    return decorator;
  }

  getMissingImports() {
    return this.missingImport;
  }

  visitTsTypes(nodes: TsType[]): TsType[] {
    return nodes;
  }

  visitTsType(nodes: TsType): TsType {
    return nodes;
  }
}
