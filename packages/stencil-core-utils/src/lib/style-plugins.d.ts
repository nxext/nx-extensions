import { Change } from '@nrwl/workspace/src/utils/ast-utils';
import * as ts from 'typescript';
import { Rule } from '@angular-devkit/schematics';
export declare enum SupportedStyles {
    css = "css",
    scss = "scss",
    styl = "styl",
    less = "less",
    pcss = "pcss"
}
export declare function addStylePlugin(stencilConfigSource: ts.SourceFile, stencilConfigPath: string, style: SupportedStyles): Change[];
export declare function addStylePluginToConfigInTree(stencilConfigPath: string, style: SupportedStyles): Rule;
