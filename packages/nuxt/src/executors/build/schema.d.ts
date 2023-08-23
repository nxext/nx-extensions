import { LoadNuxtConfigOptions } from '@nuxt/kit';

// TODO: Need to verify which options should be made available to the executor
export interface NuxtBuildExecutorOptions
  extends Pick<LoadNuxtConfigOptions['overrides'], 'debug' | 'dev' | 'ssr'> {
  outputPath: string;
}
