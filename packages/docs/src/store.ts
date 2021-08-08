import { createStore } from '@stencil/store';

export enum ModeType {
  Dark = 'dark',
  Light = 'light'
}

export interface State {
  pageTheme: ModeType;
  menuShown: boolean,
  docsMenuShown: boolean,
}

function detectUserModePreference(): ModeType {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ModeType.Dark
    : ModeType.Light;
}

export const { state, onChange } = createStore({
  menuShown: false,
  docsMenuShown: false,
  pageTheme: detectUserModePreference(),
  prismLanguagesLoaded: {},
} as State);

export default state;
