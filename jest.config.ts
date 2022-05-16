const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: [
    ...getJestProjects(),
    '<rootDir>/packages/tailwind',
    '<rootDir>/e2e/tailwind-e2e',
    '<rootDir>/e2e/sveltekit-e2e',
    '<rootDir>/e2e/solid-e2e',
    '<rootDir>/e2e/vite-e2e',
  ],
};
