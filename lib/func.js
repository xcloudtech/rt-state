"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDebugComponentName = setDebugComponentName;
exports.create = create;
exports.createS = createS;
exports.hooks = hooks;
exports.link = link;
exports.watch = watch;
var React = __importStar(require("react"));
var core_1 = require("./core");
var common_1 = require("./common");
var context_1 = require("./context");
var provider_1 = require("./provider");
// for debug only.
function setDebugComponentName(name) {
    context_1.ctxContainer.currCtx._compDebugName = "".concat(name, "_").concat(core_1.Executor.GlobalId++);
}
function create(setup, config) {
    var Comp = function (props) {
        var update = React.useReducer(function (s) { return s + 1; }, 0)[1];
        var ctxRef = React.useRef(new context_1._Context(props, update));
        var ctx = ctxRef.current;
        context_1.ctxContainer.currCtx = ctx;
        React.useEffect(function () {
            return function () {
                ctx.dispose();
                ctxRef.current = null;
            };
        }, []);
        ////////////////////////////////////////////////
        ctx.updateProps(props);
        var executor = ctx.executor;
        if (!executor) {
            if (config === null || config === void 0 ? void 0 : config.defaultProps) {
                ctx._defaultProps = Object.freeze(config === null || config === void 0 ? void 0 : config.defaultProps);
            }
            ctx._isInSetup = true;
            var render_1 = setup(ctx);
            ctx._isInSetup = false;
            executor = new core_1.Executor(function () { return render_1(ctx.props); }, update, 'comp');
            ctx.addDisposeCallBack(function () { return executor.unwatch(); });
            ctx.executor = executor;
        }
        else {
            var hooksData = ctx.use();
            var hooksRef = context_1.ctxContainer.currCtx.hooksRef;
            if (hooksRef !== undefined) {
                // Has called hooks function, so need to update the data ref.
                hooksRef.current = hooksData;
            }
        }
        if (executor._dirty) {
            executor._dirty = false;
        }
        var dom = executor.getter();
        context_1.ctxContainer.currCtx = null;
        return dom;
    };
    return (0, provider_1._provide)(Comp, config === null || config === void 0 ? void 0 : config.providers);
}
function createS(Comp, config) {
    return create(function (ctx) { return Comp; }, config);
}
function hooks(cb) {
    var currCtx = context_1.ctxContainer.currCtx;
    if (!currCtx._isInSetup) {
        throw new Error('"hooks" can only be used within the setup function of the component.');
    }
    // eslint-disable-next-line eqeqeq
    if (currCtx._hooksCb != null) {
        throw new Error('"hooks" can only be used once within the component.');
    }
    currCtx._hooksCb = cb;
    var current = cb();
    currCtx.hooksRef = { current: current };
    return currCtx.hooksRef;
}
function link(getter, setter, options) {
    var linkTarget = {};
    (0, core_1._addTargetToMap)(linkTarget);
    var value;
    var update = function (newValues) {
        value = newValues[0];
        (0, core_1.trigger)(linkTarget);
    };
    var watcher = watchWithOption(update, function () { return [getter()]; }, options);
    return {
        watcher: watcher, // just for debug.
        get value() {
            (0, core_1.track)(linkTarget);
            return value;
        },
        set value(newValue) {
            // eslint-disable-next-line eqeqeq
            if (watcher.active && setter != null) {
                setter(newValue);
            }
        },
    };
}
function watch(cb, deps, options) {
    return watchWithOption(cb, deps, options);
}
function watchWithOption(cb, deps, options) {
    var _a;
    var compare = (_a = options === null || options === void 0 ? void 0 : options.compare) !== null && _a !== void 0 ? _a : true;
    var isGlobal = options === null || options === void 0 ? void 0 : options.global;
    ////////////////////////////////////////
    var oldValues = null;
    var update = function () {
        if (!executor.active) {
            return;
        }
        var values = executor.getter();
        var needCall = true;
        if (compare) {
            needCall = (0, common_1.notEqual)(values, oldValues);
        }
        if (needCall) {
            cb(values, oldValues);
        }
        oldValues = values;
    };
    var getter = deps !== null && deps !== void 0 ? deps : (function () { return null; });
    var executor = new core_1.Executor(getter, update, 'watcher');
    var currProviderSetupCtx = context_1.ctxContainer.currProviderSetupCtx;
    // eslint-disable-next-line eqeqeq
    if (currProviderSetupCtx != null) {
        // in Provider setup callback function.
        currProviderSetupCtx.unWatchers.push(function () { return executor.unwatch(); });
    }
    else if (!isGlobal) {
        // If it is not a global watcher nor in provider setup.
        var currCtx = context_1.ctxContainer.currCtx;
        if (!currCtx || !currCtx._isInSetup) {
            throw new Error('"watch" can only be called within the setup function of the current component, or use it out of the component and set it to be global.');
        }
        currCtx.addDisposeCallBack(function () { return executor.unwatch(); });
    }
    var values = executor.getter();
    cb(values, oldValues);
    oldValues = values;
    return executor;
}
//# sourceMappingURL=func.js.map