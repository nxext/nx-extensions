/* eslint-disable */
export default {
  displayName: 'angular-vite',

  transform: {
    '^.+\\.[tj]s$': '@swc/jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/packages/angular/vite',
  preset: '../../../jest.preset.js',
};
