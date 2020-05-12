import {
  STENCIL_STYLE_PLUGIN_VERSION,
  stencilRouterVersion,
  autoprefixerVersion,
  autoprefixerTypesVersion,
  ionicVersion,
  nxextVersion,
  stencilVersion, puppeteerType, puppeteer
} from './versions';

export type SupportedStyles = 'css' | 'scss' | 'styl' | 'less' | 'postcss';

export enum AppType {
  Application = 'application',
  Library = 'library',
  Pwa = 'pwa',
}

export interface PackageDependencies {
  dependencies: DependencyEntries;
  devDependencies: DependencyEntries;
}

export interface DependencyEntries {
  [module: string]: string;
}

const stencilDependencies = {
  '@nxext/stencil': nxextVersion,
  '@stencil/core': stencilVersion,
};
const testDependencies = {
  '@types/puppeteer': puppeteerType,
  'puppeteer': puppeteer,
}

export const PROJECT_TYPE_DEPENDENCIES: {
  [AppType: string]: PackageDependencies;
} = {
  application: {
    dependencies: {},
    devDependencies: {
      ...stencilDependencies,
      '@stencil/router': stencilRouterVersion,
    },
  },
  pwa: {
    dependencies: {},
    devDependencies: {
      ...stencilDependencies,
      '@ionic/core': ionicVersion,
    },
  },
  library: {
    dependencies: {},
    devDependencies: {
      ...stencilDependencies,
    },
  },
  init: {
    dependencies: {},
    devDependencies: {
      ...stencilDependencies,
    },
  },
  e2e: {
    dependencies: {},
    devDependencies: {
      ...testDependencies,
    },
  }
};

export const STYLE_PLUGIN_DEPENDENCIES: {
  [style: string]: PackageDependencies;
} = {
  css: {
    dependencies: {},
    devDependencies: {},
  },
  less: {
    dependencies: {},
    devDependencies: {
      '@stencil/less': STENCIL_STYLE_PLUGIN_VERSION['less'],
    },
  },
  scss: {
    dependencies: {},
    devDependencies: {
      '@stencil/sass': STENCIL_STYLE_PLUGIN_VERSION['scss'],
    },
  },
  styl: {
    dependencies: {},
    devDependencies: {
      '@stencil/stylus': STENCIL_STYLE_PLUGIN_VERSION['styl'],
    },
  },
  pcss: {
    dependencies: {},
    devDependencies: {
      '@stencil/postcss': STENCIL_STYLE_PLUGIN_VERSION['pcss'],
      autoprefixer: autoprefixerVersion,
      '@types/autoprefixer': autoprefixerTypesVersion,
    },
  },
};
