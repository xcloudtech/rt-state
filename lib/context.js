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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctxContainer = exports._Context = void 0;
var core_1 = require("./core");
// Context can be used in any functions within the setup function.
var _Context = /** @class */ (function () {
    function _Context(props, update) {
        this.cleanup = new Set();
        this._props = props;
        this._watchProps = (0, core_1.stateS)(props);
        this._updateView = update;
        this._isInSetup = false;
    }
    /////////////////////////
    _Context.prototype.addDisposeCallBack = function (cb) {
        if (!this.cleanup.has(cb)) {
            this.cleanup.add(cb);
        }
    };
    _Context.prototype.dispose = function () {
        this.cleanup.forEach(function (c) { return c(); });
    };
    _Context.prototype.updateProps = function (props) {
        if (props !== this._props) {
            this._props = props;
            this._watchProps.value = props;
        }
    };
    _Context.prototype.use = function () {
        var _a, _b;
        (_a = exports.ctxContainer.currCtx._providers) === null || _a === void 0 ? void 0 : _a.forEach(function (p) {
            p.use();
        });
        return (_b = this._hooksCb) === null || _b === void 0 ? void 0 : _b.call(this);
    };
    Object.defineProperty(_Context.prototype, "debugName", {
        /////////////////////////
        // Just for debugging.
        get: function () {
            return this._compDebugName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Context.prototype, "active", {
        // if the component is unmounted, its active is false.
        get: function () {
            var _a;
            return (_a = this.executor.active) !== null && _a !== void 0 ? _a : false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Context.prototype, "props", {
        // latest Prop values with defaultProps.
        get: function () {
            // eslint-disable-next-line eqeqeq
            if (this._defaultProps != null) {
                return Object.freeze(__assign(__assign({}, this._defaultProps), this._props));
            }
            return this._props;
        },
        enumerable: false,
        configurable: true
    });
    // can be used to watch any changes of any prop in `watch` function.
    // like: ctx.w().prop1
    _Context.prototype.w = function () {
        return this._watchProps.value;
    };
    // will be called when the component is about to be unmounted.
    _Context.prototype.onDispose = function (cb) {
        this.addDisposeCallBack(cb);
        if (!this._isInSetup) {
            throw new Error('"onDispose" can only be called within the setup function of the current component.');
        }
    };
    _Context.prototype.forceUpdate = function () {
        // Avoid rendering twice for the first time.
        if (this.executor) {
            this._updateView();
        }
    };
    return _Context;
}());
exports._Context = _Context;
exports.ctxContainer = { currCtx: null, currProviderSetupCtx: null };
//# sourceMappingURL=context.js.map