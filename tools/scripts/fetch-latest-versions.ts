import { spawnSync } from 'child_process';
import {
  ionicVersion,
  puppeteer,
  STENCIL_OUTPUTTARGET_VERSION,
  STENCIL_STYLE_PLUGIN_VERSION,
  stencilRouterVersion,
  stencilVersion,
} from '../../packages/stencil/src/utils/versions';
import {
  eslintPluginSvelteVersion,
  svelteCheckVersion,
  svelteJesterVersion,
  svelteLoaderVersion,
  sveltePreprocessVersion,
  svelteVersion,
  testingLibrarySvelteVersion,
  tsconfigSvelteVersion,
  vitePluginSvelteVersion,
} from '../../packages/svelte/src/generators/utils/versions';
import {
  eslintPluginSolidVersion,
  solidJestVersion,
  solidTestingLibraryVersion,
  solidVersion,
  vitePluginSolidVersion,
} from '../../packages/solid/src/generators/utils/versions';
import {
  eslintPluginPreactVersion,
  preactVersion,
  testingLibraryPreactVersion,
  vitePluginPreactVersion,
} from '../../packages/preact/src/generators/utils/versions';
import { capacitorVersion } from '../../packages/capacitor/src/utils/versions';
import {
  vueRouterVersion,
  vueTestUtilsVersion,
  vueTscVersion,
  vueVersion,
  vitePluginVueVersion,
  eslintPluginVueVersion,
  eslintPluginPrettierVueVersion,
  eslintPluginTypescriptVueVersion,
} from '../../packages/vue/src/generators/utils/versions';

console.log('======================================');
console.log('Stencil:');
console.log('======================================');

const stencilpkgs = [
  { pkg: '@stencil/core', version: stencilVersion },
  { pkg: '@stencil/sass', version: STENCIL_STYLE_PLUGIN_VERSION['scss'] },
  { pkg: '@stencil/less', version: STENCIL_STYLE_PLUGIN_VERSION['less'] },
  { pkg: '@stencil/postcss', version: STENCIL_STYLE_PLUGIN_VERSION['pcss'] },
  { pkg: '@stencil/stylus', version: STENCIL_STYLE_PLUGIN_VERSION['styl'] },
  { pkg: '@ionic/core', version: ionicVersion },
  { pkg: '@stencil/router', version: stencilRouterVersion },

  {
    pkg: '@stencil/react-output-target',
    version: STENCIL_OUTPUTTARGET_VERSION['react'],
  },
  {
    pkg: '@stencil/vue-output-target',
    version: STENCIL_OUTPUTTARGET_VERSION['vue'],
  },
  {
    pkg: '@stencil/angular-output-target',
    version: STENCIL_OUTPUTTARGET_VERSION['angular'],
  },
  {
    pkg: '@stencil/svelte-output-target',
    version: STENCIL_OUTPUTTARGET_VERSION['svelte'],
  },

  { pkg: 'puppeteer', version: puppeteer },
];

stencilpkgs.forEach(({ pkg, version }) => {
  checkVersion(pkg, version);
});

console.log('======================================');
console.log('Svelte:');
console.log('======================================');

const sveltepkgs = [
  { pkg: 'svelte-jester', version: svelteJesterVersion },
  { pkg: 'svelte', version: svelteVersion },
  { pkg: 'svelte-check', version: svelteCheckVersion },
  { pkg: 'svelte-preprocess', version: sveltePreprocessVersion },
  { pkg: '@tsconfig/svelte', version: tsconfigSvelteVersion },
  { pkg: '@testing-library/svelte', version: testingLibrarySvelteVersion },
  { pkg: '@sveltejs/vite-plugin-svelte', version: vitePluginSvelteVersion },
  { pkg: 'eslint-plugin-svelte3', version: eslintPluginSvelteVersion },
  { pkg: 'svelte-loader', version: svelteLoaderVersion },
];

sveltepkgs.forEach(({ pkg, version }) => {
  checkVersion(pkg, version);
});

console.log('======================================');
console.log('Preact:');
console.log('======================================');

const preactPkgs = [
  { pkg: 'preact', version: preactVersion },
  { pkg: '@testing-library/preact', version: testingLibraryPreactVersion },
  { pkg: '@preact/preset-vite', version: vitePluginPreactVersion },
  { pkg: 'eslint-plugin-preact', version: eslintPluginPreactVersion },
];

preactPkgs.forEach(({ pkg, version }) => {
  checkVersion(pkg, version);
});

console.log('======================================');
console.log('Solid:');
console.log('======================================');

const solidPkgs = [
  { pkg: 'solid-jest', version: solidJestVersion },
  { pkg: 'solid-js', version: solidVersion },
  { pkg: 'solid-testing-library', version: solidTestingLibraryVersion },
  { pkg: 'eslint-plugin-solid', version: eslintPluginSolidVersion },
  { pkg: 'vite-plugin-solid', version: vitePluginSolidVersion },
];

solidPkgs.forEach(({ pkg, version }) => {
  checkVersion(pkg, version);
});

console.log('======================================');
console.log('Capacitor:');
console.log('======================================');

const capacitorPkgs = [
  { pkg: '@capacitor/core', version: capacitorVersion },
  { pkg: '@capacitor/android', version: capacitorVersion },
  { pkg: '@capacitor/ios', version: capacitorVersion },
  { pkg: '@capacitor/cli', version: capacitorVersion },
];

capacitorPkgs.forEach(({ pkg, version }) => {
  checkVersion(pkg, version);
});

console.log('======================================');
console.log('Vue:');
console.log('======================================');

const vuePkgs = [
  { pkg: 'vue-router', version: vueRouterVersion },
  { pkg: '@vue/test-utils', version: vueTestUtilsVersion },
  { pkg: 'vue-tsc', version: vueTscVersion },
  { pkg: 'vue', version: vueVersion },
  { pkg: '@vitejs/plugin-vue', version: vitePluginVueVersion },

  { pkg: 'eslint-plugin-vue', version: eslintPluginVueVersion },
  {
    pkg: '@vue/eslint-config-prettier',
    version: eslintPluginPrettierVueVersion,
  },
  {
    pkg: '@vue/eslint-config-typescript',
    version: eslintPluginTypescriptVueVersion,
  },
];

vuePkgs.forEach(({ pkg, version }) => {
  checkVersion(pkg, version);
});

function checkVersion(pkg: string, version: string = '') {
  const show = spawnSync(`npm`, ['show', pkg, 'version']);
  const currentVersion = show.stdout
    .toString()
    .replace('^', '')
    .replace('~', '')
    .trim();
  version = version.replace('^', '').replace('~', '').trim();
  if (version !== currentVersion) {
    console.log(`${pkg}: ${version} -> ${currentVersion}`);
  }
}
