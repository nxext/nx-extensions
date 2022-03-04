import { ModuleItem } from '@swc/core';
import { Visitor } from '@swc/core/Visitor.js';
import {
  createSpan,
  createStringLiteral,
  isImportDeclaration,
} from 'swc-ast-helpers';

export class AngularImportCompilerComponents extends Visitor {
  override visitModuleItems(items: ModuleItem[]): ModuleItem[] {
    return items.flatMap((item) => {
      if (isImportDeclaration(item)) {
        if (
          item.specifiers.some((imp) =>
            ['platformBrowserDynamic', 'platformBrowser'].includes(
              imp.local.value
            )
          )
        ) {
          return [
            {
              type: 'ImportDeclaration',
              span: createSpan(),
              typeOnly: false,
              specifiers: [],
              source: createStringLiteral('@angular/compiler'),
            },
            item,
          ];
        }
      }
      return item;
    });
  }
}
