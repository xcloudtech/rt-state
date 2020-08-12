import { create, createS, useHooks, watch, link, setDebugComponentName } from './func';
import { createProvider } from './provider';
import { state, stateV, stateS, setStateS, batchUpdate } from './core';
import { StateV, Context, Watcher, WatchOptions } from './model';
import { stateArray, useRStateArray, StateArray, StateArrayItem } from './long_array';
import { view } from './state_watcher';
import { useSetup, useRState, useRStateV, useRStateS } from './useFunc';

export {
    useSetup,
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
    useHooks,
    watch,
    link,
    batchUpdate,
    view,
};
export type { WatchOptions, Watcher, StateV, Context, StateArray, StateArrayItem };
export { setDebugComponentName };
