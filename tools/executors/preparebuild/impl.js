"use strict";
exports.__esModule = true;
exports.getProjectDistPath = exports.getPublishableLibNames = void 0;
var architect_1 = require("@angular-devkit/architect");
var app_root_1 = require("@nrwl/workspace/src/utils/app-root");
var rxjs_1 = require("rxjs");
var workspace_1 = require("@nrwl/workspace");
var project_graph_1 = require("@nrwl/workspace/src/core/project-graph");
var operators_1 = require("rxjs/operators");
var fileutils_1 = require("@nrwl/workspace/src/utils/fileutils");
exports["default"] = architect_1.createBuilder(function (options, context) {
    context.logger.info("Executing \"preparebuild\"...");
    var targetProject = options.projectName;
    var projGraph = project_graph_1.createProjectGraph();
    var dependencies = recursivelyCollectDependencies(targetProject, projGraph, []);
    var npmScope = workspace_1.readNxJson().npmScope;
    return rxjs_1.concat(dependencies.map(function (dep) {
        context.logger.info("Building @" + npmScope + "/" + dep + "...");
        return architect_1.scheduleTargetAndForget(context, architect_1.targetFromTargetString(dep + ":" + options.target));
    })).pipe(operators_1.switchMap(function () { return rxjs_1.from(architect_1.scheduleTargetAndForget(context, architect_1.targetFromTargetString(targetProject + ":" + options.target)))
        .pipe(operators_1.tap(function () { return context.logger.info("Building @" + npmScope + "/" + targetProject + "..."); })); }), operators_1.tap(function () {
        var publishableLibNames = getPublishableLibNames();
        var packageJsonFilePath = getProjectDistPath(targetProject) + "/package.json";
        var packageJson = workspace_1.readJsonFile(packageJsonFilePath);
        publishableLibNames.forEach(function (lib) {
            if (hasDependency(packageJson, 'dependencies', "@" + npmScope + "/" + lib)) {
                packageJson.dependencies["@" + npmScope + "/" + lib] = getProjectDistPath(lib);
            }
        });
        fileutils_1.writeJsonFile(packageJsonFilePath, packageJson);
    }));
});
function getPublishableLibNames(workspaceJson) {
    if (workspaceJson === void 0) { workspaceJson = workspace_1.readWorkspaceJson(); }
    var projects = workspaceJson.projects;
    return Object.keys(projects).filter(function (key) {
        var _a, _b;
        return projects[key].projectType === 'library' &&
            ((_b = (_a = projects[key].targets) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.executor) === '@nrwl/node:package';
    });
}
exports.getPublishableLibNames = getPublishableLibNames;
function getProjectDistPath(name) {
    return app_root_1.appRootPath + "/dist/packages/" + name;
}
exports.getProjectDistPath = getProjectDistPath;
function recursivelyCollectDependencies(project, projGraph, acc) {
    (projGraph.dependencies[project] || []).forEach(function (dependency) {
        var depNode = projGraph.nodes[dependency.target];
        if (acc.indexOf(dependency.target) === -1 && depNode.type === 'lib') {
            acc.push(dependency.target);
            recursivelyCollectDependencies(dependency.target, projGraph, acc);
        }
    });
    return acc;
}
function hasDependency(outputJson, depConfigName, packageName) {
    if (outputJson[depConfigName]) {
        return outputJson[depConfigName][packageName];
    }
    else {
        return false;
    }
}
