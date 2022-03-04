import { ModuleItem } from '@swc/core';
import { Visitor } from '@swc/core/Visitor.js';
import {
  createImportSpecifier,
  createStringLiteral,
  isCallExpression,
  isImportDeclaration,
  updateImportDeclaration,
  isExpressionStatement,
  isMemberExpression,
  isIdentifer,
  createIdentifer,
} from 'swc-ast-helpers';

export class AngularSwapPlatformDynamic extends Visitor {
  override visitModuleItems(items: ModuleItem[]): ModuleItem[] {
    let hasChangedPlatformBrowserDynamic = false;
    return items.flatMap((item) => {
      if (isImportDeclaration(item)) {
        if (item.source.value === '@angular/platform-browser-dynamic') {
          hasChangedPlatformBrowserDynamic = true;
          item.specifiers = item.specifiers.filter(
            (s) => s.local.value !== 'platformBrowserDynamic'
          );
          const updatedImport = updateImportDeclaration(
            item,
            createStringLiteral('@angular/platform-browser'),
            [createImportSpecifier('platformBrowser')]
          );
          return updatedImport;
        }
      }
      if (hasChangedPlatformBrowserDynamic && isExpressionStatement(item)) {
        if (isCallExpression(item.expression)) {
          if (isMemberExpression(item.expression.callee)) {
            if (isCallExpression(item.expression.callee.object)) {
              if (
                isMemberExpression(item.expression.callee.object.callee) &&
                isCallExpression(item.expression.callee.object.callee.object) &&
                isIdentifer(
                  item.expression.callee.object.callee.object.callee
                ) &&
                item.expression.callee.object.callee.object.callee.value ===
                  'platformBrowserDynamic'
              ) {
                item.expression.callee.object.callee.object.callee =
                  createIdentifer('platformBrowser');
              }
            }
          }
        }
      }
      return item;
    });
  }
}
