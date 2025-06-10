import {
  puppeteer,
  STENCIL_STYLE_PLUGIN_VERSION,
  stencilRouterVersion,
  stencilVersion,
} from './versions';
import { SupportedStyles } from '../stencil-core-utils';

export enum AppType {
  application = 'application',
  library = 'library',
}

export type ProjectType = 'application' | 'library';

export interface PackageDependencies {
  dependencies: DependencyEntries;
  devDependencies: DependencyEntries;
}

export interface DependencyEntries {
  [module: string]: string;
}

const stencilDependencies = {
  '@stencil/core': stencilVersion,
};
const e2ePuppeteerDependencies = {
  puppeteer: puppeteer,
};

export const PROJECT_TYPE_DEPENDENCIES: {
  [AppType: string]: PackageDependencies;
} = {
  [AppType.application]: {
    dependencies: {},
    devDependencies: {
      ...stencilDependencies,
      /**
       * @deprecated - 7-year-old one
       */
      '@stencil/router': stencilRouterVersion,
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
  puppeteer: {
    dependencies: {},
    devDependencies: {
      ...e2ePuppeteerDependencies,
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
  [SupportedStyles.scss]: {
    dependencies: {},
    devDependencies: {
      '@stencil/sass': STENCIL_STYLE_PLUGIN_VERSION[SupportedStyles.scss],
    },
  },
};
