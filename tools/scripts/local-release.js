#!/usr/bin/env node

/**
 ** Originally from https://github.com/nrwl/nx/tree/master/scripts
 */
const yargsParser = require('yargs-parser');
const childProcess = require('child_process');
const fs = require('fs');

const parsedArgs = yargsParser(process.argv, {
  boolean: ['dry-run', 'local'],
  alias: {
    d: 'dry-run',
    h: 'help',
    l: 'local',
  },
});

console.log('parsedArgs', parsedArgs);
if (parsedArgs.help) {
  console.log(`
      Usage: yarn nx-release <version> [options]

      Example: "yarn nx-release 1.0.0-beta.1"

      The acceptable format for the version number is:
      {number}.{number}.{number}[-{alpha|beta|rc}.{number}]

      The subsection of the version number in []s is optional, and, if used, will be used to
      mark the release as "prerelease" on GitHub, and tag it with "next" on npm.

      Options:
        --dry-run           Do not touch or write anything, but show the commands
        --help              Show this message
        --local             Publish to local npm registry (IMPORTANT: install & run Verdaccio first & set registry in .npmrc)

    `);
  process.exit(0);
}

function updatePackageJsonFiles(parsedVersion, isLocal) {
  let pkgFiles = [
    'dist/packages/preact/package.json',
    'dist/packages/react/package.json',
    'dist/packages/solid/package.json',
    'dist/packages/stencil/package.json',
    'dist/packages/svelte/package.json',
    'dist/packages/sveltekit/package.json',
    'dist/packages/vite/package.json',
    'dist/packages/vitest/package.json',
  ];
  if (isLocal) {
    pkgFiles = pkgFiles.filter((f) => f !== 'package.json');
  }
  pkgFiles.forEach((p) => {
    const content = JSON.parse(fs.readFileSync(p).toString());
    content.version = parsedVersion.version;
    fs.writeFileSync(p, JSON.stringify(content, null, 2));
  });
}

function parseVersion(version) {
  if (!version || !version.length) {
    return {
      version,
      isValid: false,
      isPrerelease: false,
    };
  }
  const sections = version.split('-');
  if (sections.length === 1) {
    /**
     * Not a prerelease version, validate matches exactly the
     * standard {number}.{number}.{number} format
     */
    return {
      version,
      isValid: !!sections[0].match(/\d+\.\d+\.\d+$/),
      isPrerelease: false,
    };
  }
  /**
   * Is a prerelease version, validate each section
   * 1. {number}.{number}.{number} format
   * 2. {alpha|beta|rc}.{number}
   */
  return {
    version,
    isValid: !!(
      sections[0].match(/\d+\.\d+\.\d+$/) &&
      sections[1].match(/(alpha|beta|rc)\.\d+$/)
    ),
    isPrerelease: true,
  };
}

const parsedVersion = parseVersion(parsedArgs._[2]);
if (!parsedVersion.isValid) {
  console.error(
    `\nError:\nThe specified version is not valid. You specified: "${parsedVersion.version}"`
  );
  console.error(
    `Please run "yarn nx-release --help" for details on the acceptable version format.\n`
  );
  return process.exit(1);
} else {
  console.log('parsed version: ', JSON.stringify(parsedVersion));
}

console.log('Executing build script:');
const buildCommand = `./tools/scripts/package.sh ${parsedVersion.version}`;
console.log(`> ${buildCommand}`);
childProcess.execSync(buildCommand, {
  stdio: [0, 1, 2],
});

updatePackageJsonFiles(parsedVersion, parsedArgs.local);
childProcess.execSync(
  `./tools/scripts/publish.sh ${parsedVersion.version} latest --local`,
  {
    stdio: [0, 1, 2],
  }
);
process.exit(0);
