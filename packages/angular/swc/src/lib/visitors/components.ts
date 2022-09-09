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
} from '@swc/core';
import { Visitor } from '@swc/core/Visitor.js';
import {
  createArrayExpression,
  createExpressionStatement,
  createIdentifer,
  createStringLiteral,
  createKeyValueProperty,
  createTemplateLiteral,
  createTemplateElement,
} from 'swc-ast-helpers';
import { readFileSync } from 'fs';
import { dirname, extname, join } from 'path';
import { FileRecord, FileSystem } from '../utils/file-system';

type LazyComponentUrls = { styles?: boolean; template?: boolean };

export interface AngularComponentOptions {
  sourceUrl: string;
  templateUrl?: (filePath: unknown, ext: string) => string;
  styleUrls?: (filePath: unknown, ext: string) => string;
  lazyLoad?: boolean | LazyComponentUrls;
  fileSystem?: FileSystem;
}
export class AngularComponents extends Visitor {
  #fileSystem: FileSystem;

  get fs() {
    return this.#fileSystem;
  }

  constructor(private options: AngularComponentOptions) {
    super();
    this.#fileSystem = options.fileSystem ?? new FileSystem();
  }
  override visitModuleItems(items: ModuleItem[]): ModuleItem[] {
    return items.flatMap((item) => this.visitModuleItem(item));
  }

  override visitDecorator(decorator: Decorator) {
    if (
      decorator.expression.type === 'CallExpression' &&
      (
        (decorator.expression as unknown as CallExpression)
          ?.callee as Identifier
      ).value === 'Component'
    ) {
      const fileRecord: FileRecord = {
        internalFiles: [],
      };
      const newDecorator = {
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
                  ).properties.map((prop) => {
                    if (
                      ((prop as KeyValueProperty).key as Identifier).value ===
                        'templateUrl' &&
                      (!this.options.lazyLoad ||
                        !(this.options.lazyLoad as LazyComponentUrls)?.template)
                    ) {
                      const actualImportPath = join(
                        dirname(this.options.sourceUrl),
                        ((prop as KeyValueProperty).value as Identifier).value
                      );
                      fileRecord.internalFiles.push(actualImportPath);
                      let templateContent: string;
                      if (this.options.templateUrl) {
                        templateContent = this.options.templateUrl(
                          actualImportPath,
                          extname(actualImportPath)
                        );
                      } else if (extname(actualImportPath) === '.html') {
                        templateContent = readFileSync(
                          actualImportPath,
                          'utf8'
                        );
                      } else {
                        console.error(
                          `HTML type ${extname(
                            actualImportPath
                          )} is not supported. Please use a custom templateUrl option`
                        );
                        return '';
                      }

                      return createKeyValueProperty(
                        createIdentifer('template'),
                        createTemplateLiteral([
                          createTemplateElement(templateContent, true),
                        ])
                      );
                    }

                    if (
                      ((prop as KeyValueProperty).key as Identifier).value ===
                        'styleUrls' &&
                      (!this.options.lazyLoad ||
                        !(this.options.lazyLoad as LazyComponentUrls)?.styles)
                    ) {
                      const contents = (
                        (prop as KeyValueProperty).value as ArrayExpression
                      ).elements.map((el) => {
                        const actualImportPath = join(
                          dirname(this.options.sourceUrl),
                          (el?.expression as StringLiteral).value
                        );
                        fileRecord.internalFiles.push(actualImportPath);
                        if (this.options.styleUrls) {
                          return this.options.styleUrls(
                            actualImportPath,
                            extname(actualImportPath)
                          );
                        } else if (extname(actualImportPath) === '.css') {
                          return readFileSync(actualImportPath, 'utf8');
                        } else {
                          console.error(
                            `Style type ${extname(
                              actualImportPath
                            )} is not supported. Please use a custom styleUrls option`
                          );
                          return '';
                        }
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
      if (this.options.lazyLoad) {
        this.#fileSystem.addFile(this.options.sourceUrl, fileRecord);
      }
      return newDecorator;
    }
    return decorator;
  }

  override visitTsTypes(nodes: TsType[]): TsType[] {
    return nodes;
  }

  override visitTsType(nodes: TsType): TsType {
    return nodes;
  }
}
