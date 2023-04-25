import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { setDefaultCollection } from '@nx/workspace/src/utils/rules/workspace';

function displayInformation(host: Tree, context: SchematicContext) {
  context.logger.info(stripIndents`
    @nxext/ionic-react is being set as the default default CLI collection if
    one is currently not set or is set to @nx/workspace.
  `);
}

export default function update(): Rule {
  return chain([
    displayInformation,
    setDefaultCollection('@nxext/ionic-react'),
  ]);
}
