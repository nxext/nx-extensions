module.exports = {
  name: 'solid-e2e',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/solid-e2e',
  maxWorkers: 1,
  preset: '../../jest.preset.ts',
};
