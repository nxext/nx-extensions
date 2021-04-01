module.exports = {
  someSidebar: [
    {
      type: 'category',
      label: 'Nxext',
      items: ['nxext/introduction', 'nxext/contributing'],
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
            'stencil/schematics/application',
            'stencil/schematics/ionic-app',
            'stencil/schematics/ionic-pwa',
            'stencil/schematics/storybook',
            'stencil/schematics/library',
            'stencil/schematics/add-outputtarget',
            'stencil/schematics/make-lib-buildable',
            'stencil/schematics/core',
          ],
        },
        {
          type: 'category',
          label: 'Builder',
          items: [
            'stencil/builder/build',
            'stencil/builder/test',
            'stencil/builder/e2e',
            'stencil/builder/serve',
            'stencil/builder/storybook',
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
          items: ['svelte/schematics/init', 'svelte/schematics/application'],
        },
        {
          type: 'category',
          label: 'Builder',
          items: [
            'svelte/builder/build',
            'svelte/builder/test',
            'svelte/builder/e2e',
            'svelte/builder/serve',
          ],
        },
        {
          type: 'category',
          label: 'Config examples',
          items: [
            'svelte/examples/svelte-config',
            'svelte/examples/custom-preprocessor-config',
            'svelte/examples/custom-rollup-config',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Tailwind',
      items: [
        'tailwind/overview',
        'tailwind/installation',
        {
          type: 'category',
          label: 'Schematics',
          items: ['tailwind/schematics/stencil'],
        },
      ],
    },
  ],
};
