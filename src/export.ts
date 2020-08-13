import { create, createS, hooks, watch, link, setDebugComponentName } from './func';
import { createProvider } from './provider';
import { state, stateV, stateS, setStateS, batchUpdate } from './core';
import { StateV, Context, Watcher, WatchOptions } from './model';
import { stateArray, StateArray, StateArrayItem } from './long_array';
import { view } from './view';
import { useRState, useRStateV, useRStateS, useRStateArray } from './func_use';

export {
    state,
    useRState,
    stateV,
    useRStateV,
    stateS,
    useRStateS,
    setStateS,
    stateArray,
    useRStateArray,
    create,
    createS,
    createProvider,
    hooks,
    watch,
    link,
    batchUpdate,
    view,
};
export type { WatchOptions, Watcher, StateV, Context, StateArray, StateArrayItem };
export { setDebugComponentName };
