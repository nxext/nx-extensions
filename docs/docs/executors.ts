export default {
  stencil: [
    { text: '@nxext/stencil:build', link: '/docs/stencil/executors/build' },
    { text: '@nxext/stencil:test', link: '/docs/stencil/executors/test' },
    { text: '@nxext/stencil:e2e', link: '/docs/stencil/executors/e2e' },
    { text: '@nxext/stencil:serve', link: '/docs/stencil/executors/serve' },
  ],
  sveltekit: [
    {
      text: '@nxext/sveltekit:sveltekit',
      link: '/docs/sveltekit/executors/sveltekit',
    },
    { text: '@nxext/sveltekit:add', link: '/docs/sveltekit/executors/add' },
  ],
  vite: [
    { text: '@nxext/vite:build', link: '/docs/vite/executors/build' },
    { text: '@nxext/vite:dev', link: '/docs/vite/executors/dev' },
    { text: '@nxext/vite:package', link: '/docs/vite/executors/package' },
  ],
  vitest: [
    { text: '@nxext/vitest:vitest', link: '/docs/vitest/executors/vitest' },
  ],
};
