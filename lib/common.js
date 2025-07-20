"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFn = exports.isObj = exports.notEqual = void 0;
exports.deepClone = deepClone;
var notEqual = function (a, b) {
    if (!a) {
        return true;
    }
    return a.some(function (arg, index) { return arg !== b[index]; });
};
exports.notEqual = notEqual;
var isObj = function (x) { return typeof x === 'object'; };
exports.isObj = isObj;
var isFn = function (x) { return typeof x === 'function'; };
exports.isFn = isFn;
var includeNonEnumerable = false;
function deepClone(item) {
    if (item === null || typeof item !== 'object') {
        return item;
    }
    if (item instanceof Date) {
        return new Date(item.valueOf());
    }
    if (item instanceof Array) {
        var copy_1 = [];
        item.forEach(function (_, i) { return (copy_1[i] = deepClone(item[i])); });
        return copy_1;
    }
    if (item instanceof Set) {
        var copy_2 = new Set();
        item.forEach(function (v) { return copy_2.add(deepClone(v)); });
        return copy_2;
    }
    if (item instanceof Map) {
        var copy_3 = new Map();
        item.forEach(function (v, k) { return copy_3.set(k, deepClone(v)); });
        return copy_3;
    }
    if (item instanceof Object) {
        var copy_4 = {};
        // * Object.symbol
        Object.getOwnPropertySymbols(item).forEach(function (s) { return (copy_4[s] = deepClone(item[s])); });
        // * Object.name (other)
        if (includeNonEnumerable) {
            Object.getOwnPropertyNames(item).forEach(function (k) { return (copy_4[k] = deepClone(item[k])); });
        }
        else {
            Object.keys(item).forEach(function (k) { return (copy_4[k] = deepClone(item[k])); });
        }
        return copy_4;
    }
    throw new Error("Unable to copy object: ".concat(item));
}
//# sourceMappingURL=common.js.map