"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRStateS = useRStateS;
exports.useRState = useRState;
exports.useRStateArray = useRStateArray;
exports.useOnce = useOnce;
var react_1 = require("react");
var core_1 = require("./core");
var long_array_1 = require("./long_array");
function useRStateS(initValue) {
    return (0, react_1.useMemo)(function () { return (0, core_1.stateS)(initValue); }, []);
}
function useRState(initValue, options) {
    return (0, react_1.useMemo)(function () { return (0, core_1.state)(initValue, options); }, []);
}
function useRStateArray(initValues) {
    return (0, react_1.useMemo)(function () { return (0, long_array_1.stateArray)(initValues); }, []);
}
function useOnce(initFunc) {
    return (0, react_1.useMemo)(initFunc, []);
}
//# sourceMappingURL=func_use.js.map