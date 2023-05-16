import { Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function updateViteConfig(host: Tree, options: NormalizedSchema) {
  const configPath = `${options.projectRoot}/vite.config.ts`;
  const originalContent = host.read(configPath, 'utf-8');
  const content = updateViteConfigContent(originalContent);
  host.write(configPath, content);
}

function updateViteConfigContent(content: string) {
  return content
    .replace(
      'plugins: [',
      `plugins: [
    solidPlugin(),`
    )
    .replace(
      `import { defineConfig } from 'vite';`,
      `import { defineConfig } from 'vite';
    import solidPlugin from 'vite-plugin-solid';
    `
    );
}
