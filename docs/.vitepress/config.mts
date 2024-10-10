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
      collapsed: false,
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
      text: 'Capacitor',
      collapsible: true,
      collapsed: true,
      items: [
        {
          text: 'Overview',
          link: '/docs/capacitor/overview',
        },
        {
          text: 'Generators',
          link: '/docs/capacitor/generators',
        },
        {
          text: 'Executors',
          link: '/docs/capacitor/executors',
        },
      ],
    },
    {
      text: 'Ionic Angular',
      collapsible: true,
      collapsed: true,
      items: [
        {
          text: 'Installation',
          link: '/docs/ionic-angular/installation',
        },
        {
          text: 'Generators',
          link: '/docs/ionic-angular/generators',
        },
      ],
    },
    {
      text: 'Ionic React',
      collapsible: true,
      collapsed: true,
      items: [
        {
          text: 'Generators',
          link: '/docs/ionic-react/generators',
        },
      ],
    },
    {
      text: 'Preact',
      collapsible: true,
      collapsed: true,
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
      collapsible: true,
      collapsed: true,
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
    {
      text: 'Stencil',
      collapsible: true,
      collapsed: true,
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
    {
      text: 'Svelte',
      collapsible: true,
      collapsed: true,
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
        ,
      ],
    },
    {
      text: 'SvelteKit',
      collapsible: true,
      collapsed: true,
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
  ];
}
