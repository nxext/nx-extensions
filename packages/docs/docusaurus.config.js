module.exports = {
  title: 'Nxext',
  tagline: 'Nxext brings StencilJs and Svelte to Nx',
  url: 'https://nxext.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.png',
  organizationName: 'nxext', // Usually your GitHub org/user name.
  projectName: 'Nxext', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Nxext',
      logo: {
        alt: 'Nxext Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/nxext/introduction',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        /*{ to: 'blog', label: 'Blog', position: 'left' },*/
        {
          href: 'https://github.com/nxext/nx-extensions',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        /*{
          title: 'Docs',
          items: [
            {
              label: 'Stencil',
              to: 'docs/doc1/',
            },
            {
              label: 'Svelte',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/nxext/nx-extensions',
            },
          ],
        },*/
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Dominik Pieper. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/nxext/nx-extensions/edit/master/packages/docs/docs',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/nxext/nx-extensions/edit/master/packages/docs/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
