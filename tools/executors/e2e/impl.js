"use strict";
exports.__esModule = true;
exports.runNxPluginE2EBuilder = void 0;
var architect_1 = require("@angular-devkit/architect");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
try {
    require('dotenv').config();
    // eslint-disable-next-line no-empty
}
catch (e) { }
function buildTarget(context, targets) {
    return rxjs_1.forkJoin(targets.map(function (target) { return architect_1.scheduleTargetAndForget(context, architect_1.targetFromTargetString(target)); })).pipe(operators_1.map(function (results) { return ({ success: !results.includes({ success: false }) }); }));
}
function runNxPluginE2EBuilder(options, context) {
    return buildTarget(context, options.targets).pipe(operators_1.switchMap(function () {
        return rxjs_1.from(context.scheduleBuilder('@nrwl/jest:jest', {
            jestConfig: options.jestConfig,
            watch: false
        })).pipe(operators_1.concatMap(function (run) { return run.output; }));
    }));
}
exports.runNxPluginE2EBuilder = runNxPluginE2EBuilder;
exports["default"] = architect_1.createBuilder(runNxPluginE2EBuilder);
