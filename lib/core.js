"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = void 0;
exports.stateS = stateS;
exports.setState = setState;
exports.state = state;
exports.extract = extract;
exports._addTargetToMap = _addTargetToMap;
exports.track = track;
exports.trackFields = trackFields;
exports.unstable_disableDelay = unstable_disableDelay;
exports.trigger = trigger;
var proxy_1 = require("./proxy");
var common_1 = require("./common");
var batch_update_1 = require("./batch_update");
var targetMap = new WeakMap();
var proxyToTargetMap = new WeakMap();
var currExecutor = null;
var _StateS = /** @class */ (function () {
    function _StateS(initValue) {
        this._value = initValue;
        this._state = state({ value: 0 });
    }
    Object.defineProperty(_StateS.prototype, "value", {
        get: function () {
            // Don't delete! connect view to data.
            var count = this._state.value;
            return this._value;
        },
        set: function (val) {
            var oldValue = this._value;
            this._value = val;
            if (oldValue !== val) {
                this.forceUpdate();
            }
        },
        enumerable: false,
        configurable: true
    });
    _StateS.prototype.extract = function () {
        return this._value;
    };
    _StateS.prototype.forceUpdate = function () {
        this._state.value++;
    };
    return _StateS;
}());
// just to wrap any data within the value field of a state.
// can be used for any data, especially for number and string, or an array.
// WARNING: just watch one level: the value field of the state.
function stateS(initValue) {
    return new _StateS(initValue);
}
function setState(state, value, cloneFields) {
    if (!(0, common_1.isObj)(value) || Array.isArray(value)) {
        throw new Error("value should be an object.");
    }
    value = value !== null && value !== void 0 ? value : {};
    var target = extract(state);
    Object.keys(target).forEach(function (key) {
        var fieldValue = Reflect.get(value, key);
        state[key] = cloneFields ? (0, common_1.deepClone)(fieldValue) : fieldValue;
    });
    //
    Object.keys(value).forEach(function (key) {
        if (!Reflect.has(target, key)) {
            console.error("Cannot add property ".concat(key, ", object is not extensible"));
        }
    });
}
// the state for an object.
// WARNING: just watch one level: just all fields of the object, not for the fields of any fields.
// clone: when you need to change the initValue later.
// separate: fine granularity dependency tracking based on each field, not the whole state.
function state(initValue, options) {
    // eslint-disable-next-line eqeqeq
    if (initValue == null || !(0, common_1.isObj)(initValue) || Array.isArray(initValue)) {
        throw new Error("initValue should be an object and should not be null.");
    }
    if (options === null || options === void 0 ? void 0 : options.clone) {
        initValue = (0, common_1.deepClone)(initValue);
    }
    var separate = options === null || options === void 0 ? void 0 : options.separate;
    var proxy = (0, proxy_1.getProxy)(initValue, separate ? handlersForFields : handlers); // can't run this line after the following line in IE 11.
    targetMap.set(initValue, separate ? new Map() : new Set());
    proxyToTargetMap.set(proxy, initValue);
    return proxy;
}
// extract the data without creating a dependency.
function extract(state) {
    var target;
    // eslint-disable-next-line eqeqeq
    if (state == null || (target = proxyToTargetMap.get(state)) == null) {
        throw new Error('invalid state.');
    }
    return target;
}
var handlers = {
    get: function (target, key) {
        var result = Reflect.get(target, key);
        track(target);
        return result;
    },
    set: function (target, key, value) {
        var success = setTargetFieldValue(target, key, value);
        if (success) {
            trigger(target);
        }
        return true;
    },
};
var handlersForFields = {
    get: function (target, key) {
        var result = Reflect.get(target, key);
        trackFields(target, key);
        return result;
    },
    set: function (target, key, value) {
        var success = setTargetFieldValue(target, key, value);
        if (success) {
            triggerFields(target, key);
        }
        return true;
    },
};
function setTargetFieldValue(target, key, value) {
    if (!Reflect.has(target, key)) {
        console.error("Cannot add property ".concat(key, ", object is not extensible"));
        return false;
    }
    var oldValue = Reflect.get(target, key);
    if (value === oldValue) {
        return false;
    }
    return Reflect.set(target, key, value);
}
function _addTargetToMap(target) {
    targetMap.set(target, new Set());
}
function track(target) {
    var executor = currExecutor;
    if (executor) {
        var deps = targetMap.get(target);
        linkDependencies(deps, executor);
    }
}
function trackFields(target, key) {
    var executor = currExecutor;
    if (executor) {
        var depsMap = targetMap.get(target);
        var deps = depsMap.get(key);
        if (!deps) {
            deps = new Set();
            depsMap.set(key, deps);
        }
        linkDependencies(deps, executor);
    }
}
function linkDependencies(deps, executor) {
    if (!deps.has(executor)) {
        deps.add(executor);
        executor.deps.add(deps);
    }
}
var depsCtx = {
    willUpdate: false,
    deps: new Set(),
};
var DISABLE_DELAY = false;
function unstable_disableDelay(cb) {
    var old = DISABLE_DELAY;
    DISABLE_DELAY = true;
    cb();
    realUpdates();
    DISABLE_DELAY = old;
}
function realUpdates() {
    depsCtx.willUpdate = false;
    var deps = depsCtx.deps;
    if (deps.size > 0) {
        depsCtx.deps = new Set();
        (0, batch_update_1.batchUpdate)(function () {
            deps.forEach(function (e) { return e.update(); });
        });
    }
}
function trigger(target) {
    var deps = targetMap.get(target);
    asyncUpdates(deps);
}
function triggerFields(target, key) {
    var depsMap = targetMap.get(target);
    var deps = depsMap.get(key);
    if (deps) {
        asyncUpdates(deps);
    }
}
function asyncUpdates(deps) {
    if (deps.size > 0) {
        deps.forEach(function (e) {
            e._dirty = true;
            depsCtx.deps.add(e);
        });
        if (DISABLE_DELAY || depsCtx.willUpdate) {
            return;
        }
        depsCtx.willUpdate = true;
        setTimeout(realUpdates, 10); // Promise.resolve().then(realUpdates);
    }
}
var Executor = /** @class */ (function () {
    function Executor(getter, update, type) {
        this.debugName = "".concat(type, "_").concat(Executor.GlobalId++);
        this.active = true;
        this._getter = getter;
        this._update = update;
        this._dirty = false;
    }
    Executor.prototype.update = function () {
        if (!this.active) {
            return;
        }
        if (this._dirty) {
            this._update();
        }
    };
    Executor.prototype.getter = function () {
        if (!this.active) {
            return null;
        }
        this.cleanup();
        var parent = currExecutor;
        // eslint-disable-next-line consistent-this
        currExecutor = this;
        var ret = this._getter();
        currExecutor = parent;
        if (ret === undefined) {
            return null;
        }
        return ret;
    };
    Executor.prototype.cleanup = function () {
        var _this = this;
        if (this.deps) {
            this.deps.forEach(function (deps) { return deps.delete(_this); });
        }
        this.deps = new Set();
    };
    Executor.prototype.unwatch = function () {
        if (this.active) {
            this.cleanup();
            this.active = false;
        }
    };
    // Just for debugging.
    Executor.GlobalId = 0;
    return Executor;
}());
exports.Executor = Executor;
//# sourceMappingURL=core.js.map