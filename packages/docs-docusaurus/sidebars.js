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
          label: 'Generators',
          items: [
            'stencil/generators/application',
            'stencil/generators/ionic-app',
            'stencil/generators/ionic-pwa',
            'stencil/generators/storybook',
            'stencil/generators/library',
            'stencil/generators/add-outputtarget',
            'stencil/generators/make-lib-buildable',
            'stencil/generators/init',
          ],
        },
        {
          type: 'category',
          label: 'Executors',
          items: [
            'stencil/executors/build',
            'stencil/executors/test',
            'stencil/executors/e2e',
            'stencil/executors/serve',
            'stencil/executors/storybook',
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
          label: 'Generators',
          items: ['svelte/generators/init', 'svelte/generators/application'],
        },
        {
          type: 'category',
          label: 'Executors',
          items: [
            'svelte/executors/build',
            'svelte/executors/test',
            'svelte/executors/e2e',
            'svelte/executors/serve',
          ],
        },
        {
          type: 'category',
          label: 'Config examples',
          items: [
            'svelte/examples/svelte-config',
            'svelte/examples/custom-preprocessor-config',
            'svelte/examples/custom-rollup-config',
            'svelte/examples/svelte-tailwind',
          ],
        },
      ],
    },
  ],
};
