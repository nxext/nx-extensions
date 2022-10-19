/**
 * Originally from the Nx repo: https://github.com/nrwl/nx
 */
import { removeSync, readJsonSync } from 'fs-extra';
import * as chalk from 'chalk';
import * as path from 'path';
import { dedent } from 'tslint/lib/utils';
import { FileSystemSchematicJsonDescription } from '@angular-devkit/schematics/tools';
import {
  htmlSelectorFormat,
  pathFormat,
} from '@angular-devkit/schematics/src/formats';
import {
  createDocLink,
  formatDeprecated,
  generateJsonFile,
  generateMarkdownFile,
  generateTsFile,
  sortAlphabeticallyFunction,
  sortByBooleanFunction,
} from './utils';
import {
  Configuration,
  getPackageConfigurations,
} from './get-package-configurations';
import { parseJsonSchemaToOptions } from './json-parser';
import { createSchemaFlattener, SchemaFlattener } from './schema-flattener';
import { inspect } from 'util';
import { join } from 'path';

/**
 * @WhatItDoes: Generates default documentation from the schematics' schema.
 *    We need to construct an Array of objects containing all the information
 *    of the schematics and their associated schema info. It should be easily
 *    parsable in order to be used in a rendering process using template. This
 *    in order to generate a markdown file for each available schematic.
 */
const flattener = createSchemaFlattener([pathFormat, htmlSelectorFormat]);

function generateGeneratorList(
  config: Configuration,
  flattener: SchemaFlattener
): Promise<FileSystemSchematicJsonDescription>[] {
  const schematicCollectionFilePath = path.join(config.root, 'generators.json');
  const schematicCollectionFile = readJsonSync(schematicCollectionFilePath);
  const schematicCollection =
    schematicCollectionFile.schematics || schematicCollectionFile.generators;
  return Object.keys(schematicCollection).map((schematicName) => {
    const schematic = {
      name: schematicName,
      collectionName: `@nxext/${config.name}`,
      ...schematicCollection[schematicName],
      alias: schematicCollection[schematicName].hasOwnProperty('aliases')
        ? schematicCollection[schematicName]['aliases'][0]
        : null,
      rawSchema: readJsonSync(
        path.join(config.root, schematicCollection[schematicName]['schema'])
      ),
    };

    return parseJsonSchemaToOptions(flattener, schematic.rawSchema)
      .then((options) => ({ ...schematic, options }))
      .catch((error) =>
        console.error(
          `Can't parse schema option of ${schematic.name} | ${schematic.collectionName}:\n${error}`
        )
      );
  });
}

function generateTemplate(generator): { name: string; template: string } {
  const cliCommand = 'nx';
  let template = dedent`
## ${generator.collectionName}:${generator.name} ${
    generator.hidden ? '[hidden]' : ''
  }

${generator.description}

### Usage
\`\`\`bash
${cliCommand} generate ${generator.name} ...
\`\`\`
`;

  if (generator.alias) {
    template += dedent`
    \`\`\`bash
    ${cliCommand} g ${generator.alias} ... # same
    \`\`\`
    `;
  }

  template += dedent`
  By default, Nx will search for \`${generator.name}\` in the default collection provisioned in nx.json.\n
  You can specify the collection explicitly as follows:
  \`\`\`bash
  ${cliCommand} g ${generator.collectionName}:${generator.name} ...
  \`\`\`
  `;

  template += dedent`
    Show what will be generated without writing to disk:
    \`\`\`bash
    ${cliCommand} g ${generator.name} ... --dry-run
    \`\`\`\n
    `;

  if (generator.rawSchema.examples) {
    template += `### Examples`;
    generator.rawSchema.examples.forEach((example) => {
      template += dedent`
      ${example.description}:
      \`\`\`bash
      ${cliCommand} ${example.command}
      \`\`\`
      `;
    });
  }

  if (Array.isArray(generator.options) && !!generator.options.length) {
    template += '### Options';

    generator.options
      .sort((a, b) => sortAlphabeticallyFunction(a.name, b.name))
      .sort((a, b) => sortByBooleanFunction(a.required, b.required))
      .forEach((option) => {
        let enumValues = [];
        const rawSchemaProp = generator.rawSchema.properties[option.name];
        if (
          rawSchemaProp &&
          rawSchemaProp['x-prompt'] &&
          rawSchemaProp['x-prompt'].items
        ) {
          rawSchemaProp['x-prompt'].items.forEach((p) => {
            enumValues.push(`\`${p.value}\``);
          });
        } else if (option.enum) {
          enumValues = option.enum.map((e) => `\`${e}\``);
        }

        const enumStr =
          enumValues.length > 0
            ? `Possible values: ${enumValues.join(', ')}`
            : ``;

        template += dedent`
          #### ${option.deprecated ? `~~${option.name}~~` : option.name} ${
          option.required ? '(*__required__*)' : ''
        } ${option.hidden ? '(__hidden__)' : ''}

          ${
            !!option.aliases.length
              ? `Alias(es): ${option.aliases.join(',')}\n`
              : ''
          }
          ${
            option.default === undefined || option.default === ''
              ? ''
              : `Default: \`${option.default}\`\n`
          }
          Type: \`${option.type}\`
        `;

        template += dedent`
            ${enumStr}

            ${formatDeprecated(option.description, option.deprecated)}
          `;
      });
  }

  return { name: generator.name, template };
}

export async function generateGeneratorsDocumentation() {
  console.log(`\n${chalk.blue('i')} Generating Documentation for Generators\n`);

  const { configs } = getPackageConfigurations();

  await Promise.all(
    configs
      .filter((item) => item.hasSchematics)
      .map(async (config) => {
        const generatorList = await Promise.all(
          generateGeneratorList(config, flattener)
        );

        const markdownList = generatorList
          .filter((s) => s != null && !s['hidden'])
          .map((s_1) => generateTemplate(s_1));

        await generateMarkdownFile(config.output, {
          name: 'generators',
          template: markdownList
            .map((template) => template.template)
            .join('\n'),
        });

        console.log(
          ` - Documentation for ${chalk.magenta(
            path.relative(process.cwd(), config.root)
          )} generated at ${chalk.grey(
            path.relative(process.cwd(), config.output)
          )}`
        );
      })
  );

  console.log(`\n${chalk.green('✓')} Generated Documentation for Generators`);
}
