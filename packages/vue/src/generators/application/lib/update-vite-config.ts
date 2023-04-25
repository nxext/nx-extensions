import { Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function updateViteConfig(host: Tree, options: NormalizedSchema) {
  const configPath = `${options.appProjectRoot}/vite.config.ts`;
  const originalContent = host.read(configPath, 'utf-8');
  const content = updateViteConfigContent(originalContent);
  host.write(configPath, content);
}

function updateViteConfigContent(content: string) {
  return content
    .replace(
      'plugins: [',
      `plugins: [
    vue(),`
    )
    .replace(
      `import { defineConfig } from 'vite';`,
      `import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    `
    );
}
