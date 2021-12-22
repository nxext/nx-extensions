import { execSync } from 'child_process';
import {
  ionicVersion, puppeteer, puppeteerType,
  STENCIL_OUTPUTTARGET_VERSION,
  STENCIL_STYLE_PLUGIN_VERSION, stencilRouterVersion,
  stencilVersion
} from '../../packages/stencil/src/utils/versions';

const stencilpkgs = [
  { pkg: '@stencil/core', version: stencilVersion },
  { pkg: '@stencil/sass', version: STENCIL_STYLE_PLUGIN_VERSION['scss'] },
  { pkg: '@stencil/less', version: STENCIL_STYLE_PLUGIN_VERSION['less'] },
  { pkg: '@stencil/postcss', version: STENCIL_STYLE_PLUGIN_VERSION['pcss'] },
  { pkg: '@stencil/stylus', version: STENCIL_STYLE_PLUGIN_VERSION['styl'] },
  { pkg: '@ionic/core', version: ionicVersion },
  { pkg: '@stencil/router', version: stencilRouterVersion },

  { pkg: '@stencil/react-output-target', version: STENCIL_OUTPUTTARGET_VERSION['react'] },
  { pkg: '@stencil/vue-output-target', version: STENCIL_OUTPUTTARGET_VERSION['vue'] },
  { pkg: '@stencil/angular-output-target', version: STENCIL_OUTPUTTARGET_VERSION['angular'] },
  { pkg: '@stencil/svelte-output-target', version: STENCIL_OUTPUTTARGET_VERSION['svelte'] },

  { pkg: 'puppeteer', version: puppeteer },
  { pkg: '@types/puppeteer', version: puppeteerType },
];

console.log('======================================');
console.log('Stencil:');
console.log('======================================');
stencilpkgs.forEach(({ pkg, version }) => {
  checkVersion(pkg, version);
});

const sveltepkgs = [
  'svelte-jester',
  'svelte',
  'svelte-check',
  'svelte-preprocess',
  '@tsconfig/svelte',
  '@testing-library/svelte',
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

function checkVersion(pkg: string, version: string = '') {
  if(version !== '') {
    console.log(`${pkg}: (${version})`);
  } else {
    console.log(`${pkg}: `);
  }
  execSync(`npm show ${pkg} version`, {
    stdio: [0, 1, 2]
  });
}
