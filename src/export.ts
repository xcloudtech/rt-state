import { create, createS, useHooks, watch, link, setDebugComponentName } from './func';
import { createProvider } from './context';
import { state, useRState, stateV, useRStateV, batchUpdate } from './core';
import { StateV, Context, Watcher, WatchOptions } from './model';
import { stateArray, useRStateArray, StateArray, StateArrayItem } from './long_array';
import { view } from './state_watcher';

export {
    state,
    useRState,
    stateV,
    useRStateV,
    stateArray,
    useRStateArray,
    create,
    createS,
    createProvider,
    useHooks,
    watch,
    link,
    batchUpdate,
    view,
};
export type { WatchOptions, Watcher, StateV, Context, StateArray, StateArrayItem };
export { setDebugComponentName };
