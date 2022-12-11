export interface NxPluginE2EExecutorOptions {
  jestConfig: string;
  verdaccioConfig: string;
  ci: boolean;
  testTarget: string;
  verdaccioPort: number;
}
