module.exports = {
  name: 'svelte-e2e',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/svelte-e2e',
  maxWorkers: 1,
  preset: '../../jest.preset.ts',
};
