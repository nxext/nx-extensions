import { writable } from 'svelte/store';

export enum ModeType {
  Dark = 'dark',
  Light = 'light'
}

export const mode = writable(ModeType.Light);
