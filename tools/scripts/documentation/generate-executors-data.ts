/**
 * Originally from the Nx repo: https://github.com/nrwl/nx
 */
import { readFileSync } from 'fs';
import { readJsonSync } from 'fs-extra';
import { join, relative } from 'path';
import { parseJsonSchemaToOptions } from './json-parser';
import { dedent } from 'tslint/lib/utils';
import { FileSystemSchematicJsonDescription } from '@angular-devkit/schematics/tools';
import {
  htmlSelectorFormat,
  pathFormat,
} from '@angular-devkit/schematics/src/formats';
import {
  formatDeprecated,
  generateMarkdownFile,
  sortAlphabeticallyFunction,
  sortByBooleanFunction,
} from './utils';
import {
  Configuration,
  getPackageConfigurations,
} from './get-package-configurations';
import * as chalk from 'chalk';
import { createSchemaFlattener, SchemaFlattener } from './schema-flattener';

/**
 * @WhatItDoes: Generates default documentation from the builders' schema.
 *    We need to construct an Array of objects containing all the information
 *    of the builders and their associates schema info. It should be easily
 *    parsable in order to be used in a rendering process using template. This
 *    in order to generate a markdown file for each available schematic.
 */
const flattener = createSchemaFlattener([pathFormat, htmlSelectorFormat]);

function readExecutorsJson(root: string) {
  return readJsonSync(join(root, 'executors.json')).executors;
}

function readPackageName(root: string) {
  return readJsonSync(join(root, 'package.json')).name;
}

function generateBuilderList(
  config: Configuration,
  flattener: SchemaFlattener
): Promise<FileSystemSchematicJsonDescription>[] {
  const builderCollection = readExecutorsJson(config.root);
  const packageName = readPackageName(config.root);

  return Object.keys(builderCollection).map((builderName) => {
    const schemaPath = join(
      config.root,
      builderCollection[builderName]['schema']
    );
    let builder = {
      name: builderName,
      collectionName: packageName,
      ...builderCollection[builderName],
      rawSchema: readJsonSync(schemaPath),
    };
    if (builder.rawSchema.examplesFile) {
      builder.examplesFileFullPath = join(
        schemaPath.replace('schema.json', ''),
        builder.rawSchema.examplesFile
      );
    }
    return parseJsonSchemaToOptions(flattener, builder.rawSchema)
      .then((options) => ({ ...builder, options }))
      .catch((error) =>
        console.error(`Can't parse schema option of ${builder.name}:\n${error}`)
      );
  });
}

function generateTemplate(executor): { name: string; template: string } {
  const cliCommand = 'nx';

  let template = dedent`
## ${executor.collectionName}:${executor.name}
${executor.description}

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.
\n`;

  if (executor.examplesFileFullPath) {
    template += `## Examples\n`;
    let examples = readFileSync(executor.examplesFileFullPath)
      .toString()
      .replace(/<%= cli %>/gm, cliCommand);
    template += dedent`${examples}\n`;
  }

  if (Array.isArray(executor.options) && !!executor.options.length) {
    template += '### Options';

    executor.options
      .sort((a, b) => sortAlphabeticallyFunction(a.name, b.name))
      .sort((a, b) => sortByBooleanFunction(a.required, b.required))
      .forEach((option) => {
        const enumStr = option.enum
          ? `Possible values: ${option.enum
              .map((e) => `\`${e}\``)
              .join(', ')}\n`
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
            }`;

        if (option.types && option.types.length) {
          const displayTypeList = option.types.map((type) =>
            type === 'array' ? `${option.type}[]` : type
          );
          template += dedent`
              Type: \`${displayTypeList.join(' | ')} \`\n`;
        } else {
          template += dedent`
              Type: ${
                option.arrayOfType
                  ? `\`${option.arrayOfType}[]\``
                  : `\`${option.type}\``
              } \n`;
        }

        template += dedent`
            ${enumStr}
            ${formatDeprecated(option.description, option.deprecated)}
          `;

        if (option.arrayOfType && option.arrayOfValues) {
          option.arrayOfValues.forEach((optionValue) => {
            template += dedent`
              #### ${optionValue.name} ${
              optionValue.required ? '(*__required__*)' : ''
            }
              Type: \`${optionValue.type}\` \n
              ${optionValue.description}
            `;
          });
        }
      });
  }

  return { name: executor.name, template };
}

export async function generateExecutorsDocumentation() {
  console.log(`\n${chalk.blue('i')} Generating Documentation for Executors\n`);

  const { configs } = getPackageConfigurations();

  await Promise.all(
    configs
      .filter((item) => item.hasBuilders)
      .map(async (config) => {
        const buildersList = await Promise.all(
          generateBuilderList(config, flattener)
        );

        const markdownList = buildersList
          .filter((b) => b != null && !b['hidden'])
          .map((b) => generateTemplate(b));

        await generateMarkdownFile(config.output, {
          name: 'executors',
          template: markdownList
            .map((template) => template.template)
            .join('\n'),
        });

        console.log(
          ` - Documentation for ${chalk.magenta(
            relative(process.cwd(), config.root)
          )} generated at ${chalk.grey(relative(process.cwd(), config.output))}`
        );
      })
  );

  console.log(`\n${chalk.green('✓')} Generated Documentation for Executors`);
}
