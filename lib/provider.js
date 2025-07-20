"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.createProvider = createProvider;
exports._provide = _provide;
var React = __importStar(require("react"));
var react_1 = require("react");
var context_1 = require("./context");
function createProvider(setup) {
    var Context = React.createContext(null);
    function _Provider(props) {
        var _a;
        var initValue = props.initValue;
        var ctx = (0, react_1.useMemo)(function () {
            return { _isInSetup: true, value: null, unWatchers: [] };
        }, []);
        if (ctx._isInSetup) {
            context_1.ctxContainer.currProviderSetupCtx = ctx;
            ctx.value = setup(initValue);
            ctx._isInSetup = false;
            context_1.ctxContainer.currProviderSetupCtx = null;
        }
        else {
            (_a = ctx._providers) === null || _a === void 0 ? void 0 : _a.forEach(function (p) {
                p.use();
            });
        }
        (0, react_1.useEffect)(function () {
            return function () {
                ctx.unWatchers.forEach(function (cb) {
                    cb();
                });
            };
        }, []);
        var value = ctx.value;
        return React.createElement(Context.Provider, { value: value }, props.children);
    }
    function use() {
        // @ts-ignore
        _checkAndPush(this);
        return React.useContext(Context);
    }
    function init(value) {
        return __assign(__assign({}, provider), { initValue: value });
    }
    var provider = { use: use, init: init, _Provider: _Provider, Context: Context };
    return __assign(__assign({}, provider), { initValue: null });
}
function _checkAndPush(provider) {
    var _a, _b;
    var currCtx = context_1.ctxContainer.currCtx;
    if (currCtx === null || currCtx === void 0 ? void 0 : currCtx._isInSetup) {
        // eslint-disable-next-line eqeqeq
        if (currCtx._hooksCb != null) {
            throw new Error('"Provider.use()" can only be used before "hooks" if it\'s in setup function.');
        }
        currCtx._providers = (_a = currCtx._providers) !== null && _a !== void 0 ? _a : [];
        currCtx._providers.push(provider);
        return;
    }
    var currProviderCtx = context_1.ctxContainer.currProviderSetupCtx;
    if (currProviderCtx === null || currProviderCtx === void 0 ? void 0 : currProviderCtx._isInSetup) {
        currProviderCtx._providers = (_b = currProviderCtx._providers) !== null && _b !== void 0 ? _b : [];
        currProviderCtx._providers.push(provider);
        return;
    }
}
function _provide(Comp, providers) {
    // eslint-disable-next-line eqeqeq
    if (providers == null) {
        return React.memo(Comp);
    }
    return React.memo(function (props) {
        var dom = React.createElement(Comp, __assign({}, props));
        providers.forEach(function (p) {
            var _a = p, _Provider = _a._Provider, initValue = _a.initValue;
            dom = React.createElement(_Provider, { initValue: initValue }, dom);
        });
        return dom;
    });
}
//# sourceMappingURL=provider.js.map