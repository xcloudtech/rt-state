import { create, createS, useHooks, watch, link, setDebugComponentName } from './func';
import { createProvider } from './context';
import { state, useRTState, stateV, useRTStateV, batchUpdate } from './core';
import { StateV, Context, Watcher, WatchOptions } from './model';
import { stateArray, useRTStateArray, StateArray, StateArrayItem } from './long_array';
import { view } from './state_watcher';

export {
    state,
    useRTState,
    stateV,
    useRTStateV,
    stateArray,
    useRTStateArray,
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
