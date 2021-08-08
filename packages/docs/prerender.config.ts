import { PrerenderConfig } from '@stencil/core';

export const config: PrerenderConfig = {
  hydrateOptions() {
    return {
      timeout: 50000,
    };
  },
  entryUrls: [
    '/',
    '/docs'
  ]
};
