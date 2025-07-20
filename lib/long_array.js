"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateArray = stateArray;
var core_1 = require("./core");
function stateArray(initValues) {
    return new _StateArray(initValues);
}
var _StateArray = /** @class */ (function () {
    function _StateArray(initValues) {
        this._state = (0, core_1.stateS)();
        this.values = initValues;
    }
    Object.defineProperty(_StateArray.prototype, "values", {
        get: function () {
            return this._state.value.map(function (item) { return item.value; });
        },
        set: function (values) {
            var items = [];
            values === null || values === void 0 ? void 0 : values.forEach(function (v) {
                items.push(new _StateArrayItem(v));
            });
            this._state.value = items;
        },
        enumerable: false,
        configurable: true
    });
    _StateArray.prototype.forceUpdate = function () {
        this._state.forceUpdate();
    };
    _StateArray.prototype.extract = function () {
        var items = this.extractItems();
        return items === null || items === void 0 ? void 0 : items.map(function (d) { return d === null || d === void 0 ? void 0 : d.extract(); });
    };
    Object.defineProperty(_StateArray.prototype, "length", {
        get: function () {
            return this._state.value.length;
        },
        enumerable: false,
        configurable: true
    });
    _StateArray.prototype.get = function (idx) {
        var _a;
        return (_a = this.getItem(idx)) === null || _a === void 0 ? void 0 : _a.value;
    };
    _StateArray.prototype.set = function (idx, value) {
        var item = this.getItem(idx);
        // eslint-disable-next-line eqeqeq
        if (item == null) {
            return;
        }
        item.value = value;
    };
    _StateArray.prototype.push = function (value) {
        this._state.value.push(new _StateArrayItem(value));
        this.refresh();
    };
    _StateArray.prototype.pop = function () {
        var item = this._state.value.pop();
        this.refresh();
        return item === null || item === void 0 ? void 0 : item.value;
    };
    _StateArray.prototype.add = function (idx) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        this.splice.apply(this, __spreadArray([idx, 0], values, false));
    };
    _StateArray.prototype.remove = function (idx, deleteCount) {
        this.splice(idx, deleteCount !== null && deleteCount !== void 0 ? deleteCount : 1);
    };
    _StateArray.prototype.splice = function (start, deleteCount) {
        var _a;
        var _b;
        var values = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            values[_i - 2] = arguments[_i];
        }
        var items = (_b = values === null || values === void 0 ? void 0 : values.map(function (v) { return new _StateArrayItem(v); })) !== null && _b !== void 0 ? _b : [];
        (_a = this._state.value).splice.apply(_a, __spreadArray([start, deleteCount], items, false));
        this.refresh();
    };
    Object.defineProperty(_StateArray.prototype, "items", {
        get: function () {
            return this._state.value;
        },
        enumerable: false,
        configurable: true
    });
    _StateArray.prototype.extractItems = function () {
        return this._state.extract();
    };
    _StateArray.prototype.getItem = function (idx) {
        return this._state.value[idx];
    };
    _StateArray.prototype.setItem = function (idx, item) {
        this.set(idx, item.value);
    };
    _StateArray.prototype.filterItems = function (filter) {
        var value = this._state.value;
        var newValue = value.filter(filter);
        if (newValue.length !== value.length) {
            var newArr = new _StateArray([]);
            newArr._state.value = newValue;
            return newArr;
        }
        return this;
    };
    _StateArray.prototype.mapItems = function (map) {
        return this._state.value.map(map);
    };
    _StateArray.prototype.spliceItems = function (start, deleteCount) {
        var _a;
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        (_a = this._state.value).splice.apply(_a, __spreadArray([start, deleteCount], items, false));
        this.refresh();
    };
    _StateArray.prototype.refresh = function () {
        this._state.value = __spreadArray([], this._state.value, true);
    };
    return _StateArray;
}());
var _StateArrayItem = /** @class */ (function () {
    function _StateArrayItem(initValue) {
        this._key = _StateArrayItem.LongArrayItemKeySeq++;
        this._state = (0, core_1.stateS)(initValue);
    }
    Object.defineProperty(_StateArrayItem.prototype, "value", {
        get: function () {
            return this._state.value;
        },
        set: function (value) {
            this._state.value = value;
        },
        enumerable: false,
        configurable: true
    });
    _StateArrayItem.prototype.forceUpdate = function () {
        this._state.forceUpdate();
    };
    _StateArrayItem.prototype.extract = function () {
        return this._state.extract();
    };
    Object.defineProperty(_StateArrayItem.prototype, "key", {
        get: function () {
            return this._key;
        },
        enumerable: false,
        configurable: true
    });
    _StateArrayItem.LongArrayItemKeySeq = 1;
    return _StateArrayItem;
}());
//# sourceMappingURL=long_array.js.map