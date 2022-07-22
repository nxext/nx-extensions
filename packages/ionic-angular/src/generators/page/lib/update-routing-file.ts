import { names, Tree } from '@nrwl/devkit';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { tsquery } from '@phenomnomnominal/tsquery';
import { NormalizedSchema } from '../schema';
import {
  ArrayLiteralExpression,
  Identifier,
  TypeReferenceNode,
  VariableStatement,
} from 'typescript';
import * as path from 'path';

export function updateAppRoutingModule(tree: Tree, options: NormalizedSchema) {
  const appRoutingModuleFilePath = path.join(
    options.projectRoot,
    `/src/app/app-routing.module.ts`
  );

  const appRoutingModule = readFileIfExisting(appRoutingModuleFilePath);

  if (appRoutingModule !== '') {
    const newContents = tsquery.replace(
      appRoutingModule,
      'VariableStatement',
      (node) => {
        let modifiedNode = node.getFullText();

        const vsNode = node as VariableStatement;

        vsNode.declarationList.declarations.forEach((declaration) => {
          const typeNode = declaration.type as TypeReferenceNode;
          const identifier = typeNode.typeName as Identifier;
          if (identifier.escapedText === 'Routes') {
            const pageNames = names(options.name);
            const importPath = options.directory
              ? `./${options.directory}/${pageNames.fileName}/${pageNames.fileName}.module`
              : `./${pageNames.fileName}/${pageNames.fileName}.module`;

            const toInsert = `{
              path: '${pageNames.fileName}',
              loadChildren: () =>
                import('${importPath}').then((m) => m.${pageNames.className}PageModule),
            },
            `;

            const arrLiteral =
              declaration.initializer as ArrayLiteralExpression;

            if (arrLiteral.elements.length > 0) {
              const nodeArray = arrLiteral.elements;

              const insertPosition = nodeArray[0].getStart();

              const previousRoutes = vsNode.getFullText();
              const prefix = previousRoutes.substring(0, insertPosition);
              const suffix = previousRoutes.substring(insertPosition);
              const newRoutes = `${prefix}${toInsert}${suffix}`;

              modifiedNode = newRoutes;
            }
          }
        });

        return modifiedNode;
      }
    );

    if (newContents !== appRoutingModule) {
      tree.write(appRoutingModuleFilePath, newContents);
    }
  }
}
