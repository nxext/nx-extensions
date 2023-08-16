import { Tree, writeJson, readNxJson } from '@nx/devkit';

export function addPluginToNxJson(pluginName: string, tree: Tree) {
  const nxJson = readNxJson(tree);
  nxJson.plugins = nxJson.plugins || [];
  if (!nxJson.plugins.includes(pluginName)) {
    nxJson.plugins.push(pluginName);
  }

  writeJson(tree, 'nx.json', nxJson);
}
