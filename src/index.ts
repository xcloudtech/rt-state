import { create, createS, useHooks, watch, link, setDebugComponentName } from './func';
import { createProvider } from './context';
import { state, useRTState, stateV, useRTStateV, batchUpdate } from './core';
import { StateV, Context, Watcher, WatchOptions } from './model';
import { stateArray, useRTStateArray, StateArray, StateArrayItem } from './long_array';

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
};
export type { WatchOptions, Watcher, StateV, Context, StateArray, StateArrayItem };
export { setDebugComponentName };
