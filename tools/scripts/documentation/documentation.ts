/**
 * Originally from the Nx repo: https://github.com/nrwl/nx
 */
import * as chalk from 'chalk';
import { execSync } from 'child_process';

import { generateExecutorsDocumentation } from './generate-executors-data';
import { generateGeneratorsDocumentation } from './generate-generators-data';

async function generate() {
  try {
    console.log(`${chalk.blue('i')} Generating Documentation`);
    await generateGeneratorsDocumentation();
    await generateExecutorsDocumentation();

    console.log(`\n${chalk.green('✓')} Generated Documentation\n`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function checkDocumentation() {
  const output = execSync('git status --porcelain ./docs').toString('utf-8');

  if (output) {
    console.log(
      `${chalk.red(
        '!'
      )} 📄 Documentation has been modified, you need to commit the changes. ${chalk.red(
        '!'
      )} `
    );

    console.log('\nChanged Docs:');
    execSync('git status --porcelain ./docs', { stdio: 'inherit' });

    process.exit(1);
  } else {
    console.log('📄 Documentation not modified');
  }
}

generate().then(() => {
  checkDocumentation();
});
