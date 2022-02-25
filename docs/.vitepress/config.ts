import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Nxext',
  description: 'Nxext brings different tools Nx',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  outDir: '../dist/docs',
  vue: {
    reactivityTransform: true,
  },
  themeConfig: {
    repo: 'nxext/nx-extensions',
    logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Suggest changes to this page',

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Docs', link: '/docs/nxext/overview' },
      {
        text: 'Links',
        items: [
          {
            text: 'Twitter',
            link: 'https://twitter.com/nxext_dev',
          },
          {
            text: 'Discord Chat',
            link: 'https://discord.gg/b3Kc39my',
          },
        ],
      },
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'Nxext',
          children: [
            {
              text: 'Overview',
              link: '/docs/nxext/overview',
            },
            {
              text: 'Community',
              link: '/docs/nxext/community',
            },
            {
              text: 'Contributing',
              link: '/docs/nxext/contributing',
            },
          ],
        },
        {
          text: 'Stencil',
          children: [
            {
              text: 'Overview',
              link: '/docs/stencil/overview',
            },
            {
              text: 'Installation',
              link: '/docs/stencil/installation',
            },
            {
              text: 'Generators',
              link: '/docs/stencil/generators',
            },
            {
              text: 'Executors',
              link: '/docs/stencil/executors',
            },
          ],
        },
        {
          text: 'Vite',
          children: [
            {
              text: 'Overview',
              link: '/docs/vite/overview',
            },
            {
              text: 'Installation',
              link: '/docs/vite/installation',
            },
            {
              text: 'Generators',
              link: '/docs/vite/generators',
            },
            {
              text: 'Executors',
              link: '/docs/vite/executors',
            },
          ],
        },
        {
          text: 'Svelte',
          children: [
            {
              text: 'Overview',
              link: '/docs/svelte/overview',
            },
            {
              text: 'Installation',
              link: '/docs/svelte/installation',
            },
            {
              text: 'Generators',
              link: '/docs/svelte/generators',
            },
          ],
        },
        {
          text: 'React',
          children: [
            {
              text: 'Overview',
              link: '/docs/react/overview',
            },
            {
              text: 'Installation',
              link: '/docs/react/installation',
            },
            {
              text: 'Generators',
              link: '/docs/react/generators',
            },
          ],
        },
        {
          text: 'Preact',
          children: [
            {
              text: 'Overview',
              link: '/docs/preact/overview',
            },
            {
              text: 'Installation',
              link: '/docs/preact/installation',
            },
            {
              text: 'Generators',
              link: '/docs/preact/generators',
            },
          ],
        },
        {
          text: 'Solid',
          children: [
            {
              text: 'Overview',
              link: '/docs/solid/overview',
            },
            {
              text: 'Installation',
              link: '/docs/solid/installation',
            },
            {
              text: 'Generators',
              link: '/docs/solid/generators',
            },
          ],
        },
        {
          text: 'Vitest',
          children: [
            {
              text: 'Overview',
              link: '/docs/vitest/overview',
            },
            {
              text: 'Installation',
              link: '/docs/vitest/installation',
            },
            {
              text: 'Generators',
              link: '/docs/vitest/generators',
            },
            {
              text: 'Executors',
              link: '/docs/vitest/executors',
            },
          ],
        },
        {
          text: 'Angular',
          children: [
            {
              text: 'Overview',
              link: '/docs/angular/overview',
            },
            {
              text: 'Installation',
              link: '/docs/angular/installation',
            },
            {
              text: 'Generators',
              link: '/docs/angular/nx/generators',
            },
          ],
        },
        {
          text: 'Sveltekit',
          children: [
            {
              text: 'Overview',
              link: '/docs/sveltekit/overview',
            },
            {
              text: 'Installation',
              link: '/docs/sveltekit/installation',
            },
            {
              text: 'Generators',
              link: '/docs/sveltekit/generators',
            },
            {
              text: 'Executors',
              link: '/docs/sveltekit/executors',
            },
          ],
        },
      ],
      // catch-all fallback
      '/': [
        {
          text: 'Guide',
          children: [
            {
              text: 'Why Vite',
              link: '/guide/why',
            },
            {
              text: 'Getting Started',
              link: '/guide/',
            },
            {
              text: 'Features',
              link: '/guide/features',
            },
            {
              text: 'Using Plugins',
              link: '/guide/using-plugins',
            },
            {
              text: 'Dependency Pre-Bundling',
              link: '/guide/dep-pre-bundling',
            },
            {
              text: 'Static Asset Handling',
              link: '/guide/assets',
            },
            {
              text: 'Building for Production',
              link: '/guide/build',
            },
            {
              text: 'Deploying a Static Site',
              link: '/guide/static-deploy',
            },
            {
              text: 'Env Variables and Modes',
              link: '/guide/env-and-mode',
            },
            {
              text: 'Server-Side Rendering (SSR)',
              link: '/guide/ssr',
            },
            {
              text: 'Backend Integration',
              link: '/guide/backend-integration',
            },
            {
              text: 'Comparisons',
              link: '/guide/comparisons',
            },
            {
              text: 'Migration from v1',
              link: '/guide/migration',
            },
          ],
        },
        {
          text: 'APIs',
          children: [
            {
              text: 'Plugin API',
              link: '/guide/api-plugin',
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr',
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript',
            },
          ],
        },
      ],
    },
  },
});
