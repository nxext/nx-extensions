import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'en-US',
  title: 'Nxext',
  description: 'Nxext brings different tools to Nx',
  outDir: '../dist/docs',

  themeConfig: {
    siteTitle: 'Nxext',
    logo: '/logo.svg',
    nav: nav(),

    sidebar: {
      '/guide/': sideNavGuide(),
      '/docs/': sideNavDocs(),
    },

    footer: {
      message:
        'MIT Licensed | Copyright © 2020-present Nxext Developers & Contributors',
      copyright:
        '<a href="https://www.netlify.com"> <img src="https://www.netlify.com/v3/img/components/netlify-color-bg.svg" alt="Deploys by Netlify" /> </a>',
    },
  },
});

function nav() {
  return [
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
          text: 'Nx Discord Chat',
          link: 'https://discord.gg/SWyp4xfGjn',
        },
        {
          text: 'Github',
          link: 'https://github.com/nxext/nx-extensions',
        },
      ],
    },
  ];
}

function sideNavGuide() {
  return [
    {
      text: 'Guide',
      items: [
        {
          text: 'Getting Started',
          link: '/guide/',
        },
        {
          text: 'Articles',
          link: '/guide/articles',
        },
      ],
    },
  ];
}

function sideNavDocs() {
  return [
    {
      text: 'Nxext',
      collapsible: true,
      items: [
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
      text: 'Vite projects',
      collapsible: true,
      collapsed: true,
      items: [
        {
          text: 'Vue',
          items: [
            {
              text: 'Overview',
              link: '/docs/vue/overview',
            },
            {
              text: 'Installation',
              link: '/docs/vue/installation',
            },
            {
              text: 'Generators',
              link: '/docs/vue/generators',
            },
          ],
        },
        {
          text: 'Svelte',
          items: [
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
          text: 'Preact',
          items: [
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
          items: [
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
      ],
    },
    {
      text: 'Ionic projects',
      collapsible: true,
      collapsed: true,
      items: [
        {
          text: 'Stencil',
          items: [
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
      ],
    },
    {
      text: 'Unstable/Alpha projects',
      collapsible: true,
      collapsed: true,
      items: [
        {
          text: 'Sveltekit',
          items: [
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
        {
          text: 'Nuxt',
          items: [
            {
              text: 'Overview',
              link: '/docs/nuxt/overview',
            },
            {
              text: 'Installation',
              link: '/docs/nuxt/installation',
            },
            {
              text: 'Generators',
              link: '/docs/nuxt/generators',
            },
            {
              text: 'Executors',
              link: '/docs/nuxt/executors',
            },
          ],
        },
      ],
    },
    {
      text: 'Deprecated projects',
      collapsible: true,
      collapsed: true,
      items: [
        {
          text: 'Vite',
          items: [
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
          text: 'Vitest',
          items: [
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
          text: 'React',
          items: [
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
      ],
    },
  ];
}
