"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToPlugins = exports.addToOutputTargets = void 0;
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const ts = require("typescript");
function addCodeIntoArray(source, identifier, toInsert, file) {
    const nodes = ast_utils_1.findNodes(source, ts.SyntaxKind.ObjectLiteralExpression);
    let node = nodes[0];
    const matchingProperties = node.properties
        .filter((prop) => prop.kind == ts.SyntaxKind.PropertyAssignment)
        .filter((prop) => {
        if (prop.name.kind === ts.SyntaxKind.Identifier) {
            return (prop.name.getText(source) == identifier);
        }
        return false;
    });
    if (!matchingProperties) {
        return [];
    }
    if (matchingProperties.length == 0) {
        // We haven't found the field in the metadata declaration. Insert a new field.
        const expr = node;
        let position;
        let toInsert2;
        if (expr.properties.length == 0) {
            position = expr.getEnd() - 1;
            toInsert2 = `  ${identifier}: [${toInsert}]\n`;
        }
        else {
            node = expr.properties[expr.properties.length - 1];
            position = node.getEnd();
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            if (text.match('^\r?\r?\n')) {
                toInsert2 = `,${text.match(/^\r?\n\s+/)[0]}${identifier}: [${toInsert}]`;
            }
            else {
                toInsert2 = `, ${identifier}: [${toInsert}]`;
            }
        }
        const newMetadataProperty = new ast_utils_1.InsertChange(file, position, toInsert2);
        return [newMetadataProperty];
    }
    const assignment = matchingProperties[0];
    if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return [];
    }
    const lastItem = getLastEntryOfOutputtargetArray(assignment);
    let toInsert2 = `, ${toInsert}`;
    if (lastItem.getText() === ',') {
        toInsert2 = toInsert;
    }
    return [new ast_utils_1.InsertChange(file, lastItem.getEnd(), toInsert2)];
}
function getLastEntryOfOutputtargetArray(node) {
    const arrayEntryList = node.getChildren()[2].getChildren()[1].getChildren();
    return arrayEntryList
        .sort((first, second) => first.getStart() - second.getStart())
        .pop();
}
function addToOutputTargets(source, toInsert, file) {
    const outputTargetsIdentifier = 'outputTargets';
    return addCodeIntoArray(source, outputTargetsIdentifier, toInsert, file);
}
exports.addToOutputTargets = addToOutputTargets;
function addToPlugins(source, file, toInsert) {
    const pluginsIdentifier = 'plugins';
    return addCodeIntoArray(source, pluginsIdentifier, toInsert, file);
}
exports.addToPlugins = addToPlugins;
//# sourceMappingURL=plugins.js.map