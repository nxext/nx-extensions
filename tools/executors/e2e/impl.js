'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === 'function' ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb('next'),
        verb('throw'),
        verb('return'),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
var __await =
  (this && this.__await) ||
  function (v) {
    return this instanceof __await ? ((this.v = v), this) : new __await(v);
  };
var __asyncGenerator =
  (this && this.__asyncGenerator) ||
  function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
    return (
      (i = {}),
      verb('next'),
      verb('throw'),
      verb('return'),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i
    );
    function verb(n) {
      if (g[n])
        i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await
        ? Promise.resolve(r.value.v).then(fulfill, reject)
        : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume('next', value);
    }
    function reject(value) {
      resume('throw', value);
    }
    function settle(f, v) {
      if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
    }
  };
exports.__esModule = true;
exports.nxPluginE2EExecutor = void 0;
require('dotenv/config');
var devkit_1 = require('@nrwl/devkit');
var jest_impl_1 = require('@nrwl/jest/src/executors/jest/jest.impl');
function nxPluginE2EExecutor(options, context) {
  return __asyncGenerator(this, arguments, function nxPluginE2EExecutor_1() {
    var success, _a, _b, _, e_1, e_2_1;
    var e_2, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          _d.trys.push([0, 8, 9, 14]);
          _a = __asyncValues(
            options.targets.map(function (target) {
              return runBuildTarget(target, context);
            })
          );
          _d.label = 1;
        case 1:
          return [4 /*yield*/, __await(_a.next())];
        case 2:
          if (!((_b = _d.sent()), !_b.done)) return [3 /*break*/, 7];
          _ = _b.value;
          _d.label = 3;
        case 3:
          _d.trys.push([3, 5, , 6]);
          return [4 /*yield*/, __await(runTests(options.jestConfig, context))];
        case 4:
          success = _d.sent();
          return [3 /*break*/, 6];
        case 5:
          e_1 = _d.sent();
          devkit_1.logger.error(e_1.message);
          success = false;
          return [3 /*break*/, 6];
        case 6:
          return [3 /*break*/, 1];
        case 7:
          return [3 /*break*/, 14];
        case 8:
          e_2_1 = _d.sent();
          e_2 = { error: e_2_1 };
          return [3 /*break*/, 14];
        case 9:
          _d.trys.push([9, , 12, 13]);
          if (!(_b && !_b.done && (_c = _a['return'])))
            return [3 /*break*/, 11];
          return [4 /*yield*/, __await(_c.call(_a))];
        case 10:
          _d.sent();
          _d.label = 11;
        case 11:
          return [3 /*break*/, 13];
        case 12:
          if (e_2) throw e_2.error;
          return [7 /*endfinally*/];
        case 13:
          return [7 /*endfinally*/];
        case 14:
          return [4 /*yield*/, __await({ success: success })];
        case 15:
          return [2 /*return*/, _d.sent()];
      }
    });
  });
}
exports.nxPluginE2EExecutor = nxPluginE2EExecutor;
function runBuildTarget(buildTarget, context) {
  return __asyncGenerator(this, arguments, function runBuildTarget_1() {
    var _a,
      project,
      target,
      configuration,
      buildTargetOptions,
      targetSupportsWatch,
      _b,
      _c,
      output,
      e_3_1;
    var e_3, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          (_a = (0, devkit_1.parseTargetString)(buildTarget)),
            (project = _a.project),
            (target = _a.target),
            (configuration = _a.configuration);
          buildTargetOptions = (0, devkit_1.readTargetOptions)(
            { project: project, target: target, configuration: configuration },
            context
          );
          targetSupportsWatch =
            Object.keys(buildTargetOptions).includes('watch');
          _e.label = 1;
        case 1:
          _e.trys.push([1, 9, 10, 15]);
          return [
            4 /*yield*/,
            __await(
              (0, devkit_1.runExecutor)(
                {
                  project: project,
                  target: target,
                  configuration: configuration,
                },
                targetSupportsWatch ? { watch: false } : {},
                context
              )
            ),
          ];
        case 2:
          _b = __asyncValues.apply(void 0, [_e.sent()]);
          _e.label = 3;
        case 3:
          return [4 /*yield*/, __await(_b.next())];
        case 4:
          if (!((_c = _e.sent()), !_c.done)) return [3 /*break*/, 8];
          output = _c.value;
          if (!output.success)
            throw new Error('Could not compile application files.');
          return [4 /*yield*/, __await(output.success)];
        case 5:
          return [4 /*yield*/, _e.sent()];
        case 6:
          _e.sent();
          _e.label = 7;
        case 7:
          return [3 /*break*/, 3];
        case 8:
          return [3 /*break*/, 15];
        case 9:
          e_3_1 = _e.sent();
          e_3 = { error: e_3_1 };
          return [3 /*break*/, 15];
        case 10:
          _e.trys.push([10, , 13, 14]);
          if (!(_c && !_c.done && (_d = _b['return'])))
            return [3 /*break*/, 12];
          return [4 /*yield*/, __await(_d.call(_b))];
        case 11:
          _e.sent();
          _e.label = 12;
        case 12:
          return [3 /*break*/, 14];
        case 13:
          if (e_3) throw e_3.error;
          return [7 /*endfinally*/];
        case 14:
          return [7 /*endfinally*/];
        case 15:
          return [2 /*return*/];
      }
    });
  });
}
function runTests(jestConfig, context) {
  return __awaiter(this, void 0, void 0, function () {
    var success;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, jest_impl_1.jestExecutor)(
              { jestConfig: jestConfig, watch: false },
              context
            ),
          ];
        case 1:
          success = _a.sent().success;
          return [2 /*return*/, success];
      }
    });
  });
}
exports['default'] = nxPluginE2EExecutor;
