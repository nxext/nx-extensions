"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStylePluginToConfigInTree = exports.addStylePlugin = exports.SupportedStyles = void 0;
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const plugins_1 = require("./plugins");
const ast_utils_2 = require("../../../stencil/src/utils/ast-utils");
const workspace_1 = require("@nrwl/workspace");
var SupportedStyles;
(function (SupportedStyles) {
    SupportedStyles["css"] = "css";
    SupportedStyles["scss"] = "scss";
    SupportedStyles["styl"] = "styl";
    SupportedStyles["less"] = "less";
    SupportedStyles["pcss"] = "pcss";
})(SupportedStyles = exports.SupportedStyles || (exports.SupportedStyles = {}));
function addStylePlugin(stencilConfigSource, stencilConfigPath, style) {
    const styleImports = {
        [SupportedStyles.css]: [],
        [SupportedStyles.scss]: [
            ast_utils_1.insertImport(stencilConfigSource, stencilConfigPath, 'sass', '@stencil/sass'),
            ...plugins_1.addToPlugins(stencilConfigSource, stencilConfigPath, 'sass()')
        ],
        [SupportedStyles.styl]: [
            ast_utils_1.insertImport(stencilConfigSource, stencilConfigPath, 'stylus', '@stencil/stylus'),
            ...plugins_1.addToPlugins(stencilConfigSource, stencilConfigPath, 'stylus()')
        ],
        [SupportedStyles.less]: [
            ast_utils_1.insertImport(stencilConfigSource, stencilConfigPath, 'less', '@stencil/less'),
            ...plugins_1.addToPlugins(stencilConfigSource, stencilConfigPath, 'less()')
        ],
        [SupportedStyles.pcss]: [
            ast_utils_1.insertImport(stencilConfigSource, stencilConfigPath, 'postcss', '@stencil/postcss'),
            ast_utils_1.insertImport(stencilConfigSource, stencilConfigPath, 'autoprefixer', 'autoprefixer'),
            ...plugins_1.addToPlugins(stencilConfigSource, stencilConfigPath, `
          postcss({
            plugins: [autoprefixer()]
          })
          `)
        ]
    };
    return styleImports[style];
}
exports.addStylePlugin = addStylePlugin;
function addStylePluginToConfigInTree(stencilConfigPath, style) {
    return (tree) => {
        const stencilConfigSource = ast_utils_2.readTsSourceFileFromTree(tree, stencilConfigPath);
        workspace_1.insert(tree, stencilConfigPath, addStylePlugin(stencilConfigSource, stencilConfigPath, style));
        return tree;
    };
}
exports.addStylePluginToConfigInTree = addStylePluginToConfigInTree;
//# sourceMappingURL=style-plugins.js.map