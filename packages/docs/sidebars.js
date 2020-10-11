module.exports = {
  someSidebar: [
    {
      type: 'category',
      label: 'Nxext',
      items: [
        'nxext/introduction',
        'nxext/contributing'
      ],
    },
    {
      type: 'category',
      label: 'Stencil',
      items: [
        'stencil/overview',
        'stencil/installation',
        {
          type: 'category',
          label: 'Schematics',
          items: [
            'stencil/schematics/core',
            'stencil/schematics/application',
            'stencil/schematics/library',
            'stencil/schematics/add-outputtarget',
            'stencil/schematics/ionic-app',
            'stencil/schematics/ionic-pwa',
            'stencil/schematics/storybook',
          ],
        },
        {
          type: 'category',
          label: 'Builder',
          items: [
            'stencil/builder/build',
            'stencil/builder/test',
            'stencil/builder/serve',
            'stencil/builder/storybook'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Svelte',
      items: [
        'svelte/overview',
        'svelte/installation',
        {
          type: 'category',
          label: 'Schematics',
          items: [
            'svelte/schematics/init',
            'svelte/schematics/application',
          ],
        },
        {
          type: 'category',
          label: 'Builder',
          items: [
            'svelte/builder/build',
            'svelte/builder/test',
            'svelte/builder/serve'
          ],
        },
      ],
    },
  ],
};
