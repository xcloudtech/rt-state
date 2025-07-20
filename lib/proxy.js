"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxy = void 0;
exports.getProxy = (function () {
    return function (raw, handlers) { return new Proxy(raw, handlers); };
})();
//# sourceMappingURL=proxy.js.map