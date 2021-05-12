import { execSync } from 'child_process';
const stencilpkgs = [
  '@stencil/core',
  '@stencil/sass',
  '@stencil/less',
  '@stencil/postcss',
  '@stencil/stylus',
  '@ionic/core',
  '@stencil/router',

  '@stencil/react-output-target',
  '@stencil/vue-output-target',
  '@stencil/angular-output-target',
  '@stencil/svelte-output-target',
];

console.log('======================================');
console.log('Stencil:');
console.log('======================================');
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
  '@sveltejs/vite-plugin-svelte'
];

console.log('======================================');
console.log('Svelte:');
console.log('======================================');
sveltepkgs.forEach((pkg) => {
  checkVersion(pkg);
});

const vitePkgs = [
  'vite'
];

console.log('======================================');
console.log('Vite:');
console.log('======================================');
vitePkgs.forEach((pkg) => {
  checkVersion(pkg);
});

function checkVersion(pkg) {
  console.log(`${pkg}: `);
  execSync(`npm show ${pkg} version`, {
    stdio: [0, 1, 2]
  })
}
