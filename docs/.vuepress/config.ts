import { defineUserConfig, defaultTheme } from 'vuepress';
import { searchPlugin } from '@vuepress/plugin-search';
import generators from '../docs/generators';
import executors from '../docs/executors';

export default defineUserConfig({
  lang: 'en-US',
  title: 'Nxext',

  dest: '../dist/docs',
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/logo.svg',
      },
    ],
  ],

  plugins: [searchPlugin()],

  theme: defaultTheme({
    logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'main',
    repo: 'nxext/nx-extensions',
    editLink: true,
    editLinkText: 'Suggest changes to this page',

    themePlugins: {
      backToTop: true,
    },

    navbar: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Docs', link: '/docs/nxext/overview' },
      {
        text: 'Links',
        children: [
          {
            text: 'Twitter',
            link: 'https://twitter.com/nxext_dev',
          },
          {
            text: 'Discord Chat',
            link: 'https://discord.gg/Hqjp9NrZQ7',
          },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          children: [
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
        {
          text: 'Vite',
          children: [
            {
              text: 'Environment variables',
              link: '/guide/vite/environment-variables',
            },
          ],
        },
      ],
      '/docs/': [
        {
          text: 'Nxext',
          collapsible: true,
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
          text: 'Ionic projects',
          collapsible: false,
          children: [
            {
              text: 'Stencil',
              collapsible: true,
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
                  children: generators.stencil,
                },
                {
                  text: 'Executors',
                  children: executors.stencil,
                },
              ],
            },
            /*{
              text: 'Capacitor',
              collapsible: true,
              children: [
                {
                  text: 'Overview',
                  link: '/docs/capacitor/overview',
                },
                {
                  text: 'Getting started',
                  link: '/docs/capacitor/getting-started',
                },
                {
                  text: 'Generators',
                  children: generators.capacitor,
                },
                {
                  text: 'Executors',
                  children: executors.capacitor,
                },
              ],
            },
            {
              text: 'Ionic Angular',
              collapsible: true,
              children: [
                {
                  text: 'Overview',
                  link: '/docs/ionic-angular/overview',
                },
                {
                  text: 'Getting started',
                  link: '/docs/ionic-angular/getting-started',
                },
                {
                  text: 'Capacitor',
                  link: '/docs/ionic-angular/capacitor',
                },
                {
                  text: 'Generators',
                  children: generators['ionic-angular'],
                },
              ],
            },
            {
              text: 'Ionic React',
              collapsible: true,
              children: [
                {
                  text: 'Overview',
                  link: '/docs/ionic-react/overview',
                },
                {
                  text: 'Getting started',
                  link: '/docs/ionic-react/getting-started',
                },
                {
                  text: 'Capacitor',
                  link: '/docs/ionic-react/capacitor',
                },
                {
                  text: 'Generators',
                  children: generators['ionic-react'],
                },
              ],
            },
            */
          ],
        },
        {
          text: 'Vite projects',
          children: [
            {
              text: 'Vite',
              collapsible: true,
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
                  children: generators.vite,
                },
                {
                  text: 'Executors',
                  children: executors.vite,
                },
              ],
            },
            {
              text: 'Svelte',
              collapsible: true,
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
                  children: generators.svelte,
                },
              ],
            },
            {
              text: 'React',
              collapsible: true,
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
                  children: generators.react,
                },
              ],
            },
            {
              text: 'Preact',
              collapsible: true,
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
                  children: generators.preact,
                },
              ],
            },
            {
              text: 'Solid',
              collapsible: true,
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
                  children: generators.solid,
                },
              ],
            },
            {
              text: 'Vitest',
              collapsible: true,
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
                  children: generators.vitest,
                },
                {
                  text: 'Executors',
                  children: executors.vitest,
                },
              ],
            },
          ],
        },
        {
          text: 'Unstable/Alpha projects',
          children: [
            {
              text: 'Angular',
              collapsible: true,
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
                  children: generators.angular,
                },
              ],
            },
            {
              text: 'Sveltekit',
              collapsible: true,
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
                  children: generators.sveltekit,
                },
                {
                  text: 'Executors',
                  children: executors.sveltekit,
                },
              ],
            },
          ],
        },
      ],
    },
  }),
});
