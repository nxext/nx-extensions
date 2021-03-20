import { exec } from 'child_process';

const stencilpkgs = [
  '@stencil/core',
  '@stencil/sass',
  '@stencil/less',
  '@stencil/postcss',
  '@stencil/stylus',

  '@stencil/react-output-target',
  '@stencil/vue-output-target',
  '@stencil/angular-output-target',
  '@stencil/svelte-output-target',
];

console.log('Stencil:');
stencilpkgs.forEach((pkg) => {
  checkVersion(pkg);
});

const sveltepkgs = [
  'svelte-jester',
  'svelte',
  'svelte-check',
  'svelte-preprocess',
  '@tsconfig/svelte',
  '@testing-library/svelte',
  'rollup-plugin-local-resolve',
];

console.log('======================================');
console.log('Svelte:');
sveltepkgs.forEach((pkg) => {
  checkVersion(pkg);
});

function checkVersion(pkg) {
  exec(`npm show ${pkg} version`, (error, stdout, sterr) => {
    if (error) {
      console.log(`Error fetching ${pkg}`);
      return;
    }
    console.log(`${pkg} = ${stdout}`);
  });
}
