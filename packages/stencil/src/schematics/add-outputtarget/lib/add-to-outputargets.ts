import { Change, findNodes, InsertChange } from '@nrwl/workspace/src/utils/ast-utils';
import * as ts from 'typescript';

export function addToOutputTargets(
  source: ts.SourceFile,
  toInsert: string,
  file: string
): Change[] {
  const outputTargetsIdentifier = 'outputTargets';
  const nodes = findNodes(source, ts.SyntaxKind.ObjectLiteralExpression);
  let node = nodes[0];
  const matchingProperties: ts.ObjectLiteralElement[] = (node as ts.ObjectLiteralExpression).properties
    .filter((prop) => prop.kind == ts.SyntaxKind.PropertyAssignment)
    .filter((prop: ts.PropertyAssignment) => {
      if (prop.name.kind === ts.SyntaxKind.Identifier) {
        return (
          (prop.name as ts.Identifier).getText(source) ==
          outputTargetsIdentifier
        );
      }

      return false;
    });

  if (!matchingProperties) {
    return [];
  }

  if (matchingProperties.length == 0) {
    // We haven't found the field in the metadata declaration. Insert a new field.
    const expr = node as ts.ObjectLiteralExpression;
    let position: number;
    let toInsert2: string;
    if (expr.properties.length == 0) {
      position = expr.getEnd() - 1;
      toInsert2 = `  ${outputTargetsIdentifier}: [${toInsert}]\n`;
    } else {
      node = expr.properties[expr.properties.length - 1];
      position = node.getEnd();
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      if (text.match('^\r?\r?\n')) {
        toInsert2 = `,${
          text.match(/^\r?\n\s+/)[0]
        }${outputTargetsIdentifier}: [${toInsert}]`;
      } else {
        toInsert2 = `, ${outputTargetsIdentifier}: [${toInsert}]`;
      }
    }
    const newMetadataProperty = new InsertChange(file, position, toInsert2);
    return [newMetadataProperty];
  }

  const assignment = matchingProperties[0] as ts.PropertyAssignment;
  if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return [];
  }

  const lastItem = getLastEntryOfOutputtargetArray(assignment);

  let toInsert2 = `, ${toInsert}`;
  if (lastItem.getText() === ',') {
    toInsert2 = toInsert;
  }

  return [new InsertChange(file, lastItem.getEnd(), toInsert2)];
}

function getLastEntryOfOutputtargetArray(node: ts.Node) {
  const arrayEntryList = node.getChildren()[2].getChildren()[1].getChildren();
  return arrayEntryList
    .sort(
      (first: ts.Node, second: ts.Node) => first.getStart() - second.getStart()
    )
    .pop();
}
