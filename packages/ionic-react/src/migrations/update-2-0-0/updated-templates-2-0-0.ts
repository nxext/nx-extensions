import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';

function displayInformation(host: Tree, context: SchematicContext) {
  context.logger.info(stripIndents`
    Ionic starter templates have been updated. You may want to view the pull request and
    make the according changes to your project. View the MIGRATION.md file for more information.

    https://github.com/devinshoemaker/nxtend/blob/%40nxtend/ionic-react%402.0.0/libs/ionic-react/MIGRATION.md
  `);
}

export default function update(): Rule {
  return chain([displayInformation]);
}
