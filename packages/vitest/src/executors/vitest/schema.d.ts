export interface VitestExecutorOptions {
  passWithNoTests?: boolean;
  watch?: boolean;
  coverage?: boolean;
  ui?: boolean;
  vitestConfig: string;
  vitestMode: 'test' | 'benchmark';
}
