import {
  autoprefixerTypesVersion,
  autoprefixerVersion,
  ionicVersion,
  nxextVersion,
  puppeteer,
  puppeteerType,
  STENCIL_STYLE_PLUGIN_VERSION,
  stencilRouterVersion,
  stencilVersion,
} from './versions';
import { SupportedStyles } from '@nxext/stencil-core-utils';

export enum AppType {
  application = 'application',
  library = 'library',
  pwa = 'pwa',
  capacitorapp = 'capacitorapp',
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
  puppeteer: puppeteer,
};

export const PROJECT_TYPE_DEPENDENCIES: {
  [AppType: string]: PackageDependencies;
} = {
  [AppType.application]: {
    dependencies: {},
    devDependencies: {
      ...stencilDependencies,
      '@stencil/router': stencilRouterVersion,
    },
  },
  [AppType.pwa]: {
    dependencies: {},
    devDependencies: {
      ...stencilDependencies,
      '@ionic/core': ionicVersion,
    },
  },
  [AppType.capacitorapp]: {
    dependencies: {},
    devDependencies: {
      ...stencilDependencies,
      '@ionic/core': ionicVersion,
    },
  },
  [AppType.library]: {
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
  },
};

export const STYLE_PLUGIN_DEPENDENCIES: {
  [style: string]: PackageDependencies;
} = {
  [SupportedStyles.css]: {
    dependencies: {},
    devDependencies: {},
  },
  [SupportedStyles.less]: {
    dependencies: {},
    devDependencies: {
      '@stencil/less': STENCIL_STYLE_PLUGIN_VERSION[SupportedStyles.less],
    },
  },
  [SupportedStyles.scss]: {
    dependencies: {},
    devDependencies: {
      '@stencil/sass': STENCIL_STYLE_PLUGIN_VERSION[SupportedStyles.scss],
    },
  },
  [SupportedStyles.styl]: {
    dependencies: {},
    devDependencies: {
      '@stencil/stylus': STENCIL_STYLE_PLUGIN_VERSION[SupportedStyles.styl],
    },
  },
  [SupportedStyles.pcss]: {
    dependencies: {},
    devDependencies: {
      '@stencil/postcss': STENCIL_STYLE_PLUGIN_VERSION[SupportedStyles.pcss],
      autoprefixer: autoprefixerVersion,
      '@types/autoprefixer': autoprefixerTypesVersion,
    },
  },
};
