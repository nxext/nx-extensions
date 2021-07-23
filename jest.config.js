const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/packages/tailwind',
    '<rootDir>/e2e/tailwind-e2e',
    '<rootDir>/e2e/sveltekit-e2e',
    '<rootDir>/e2e/vite-e2e',
  ],
};
