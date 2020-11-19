import { Change } from '@nrwl/workspace/src/utils/ast-utils';
import * as ts from 'typescript';
export declare function addToOutputTargets(source: ts.SourceFile, toInsert: string, file: string): Change[];
export declare function addToPlugins(source: ts.SourceFile, file: string, toInsert: string): Change[];
