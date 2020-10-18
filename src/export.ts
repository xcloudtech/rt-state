import { HooksRef } from './common';
import { create, createS, hooks, watch, link, setDebugComponentName } from './func';
import { createProvider } from './provider';
import { state, extract, setState, stateS, unstable_disableDelay } from './core';
import { State, StateS, StateLink, Context, Watcher, WatchOptions } from './model';
import { stateArray, StateArray, StateArrayItem } from './long_array';
import { view } from './view';
import { useRState, useRStateS, useRStateArray } from './func_use';

export {
    state,
    extract,
    setState,
    useRState,
    stateS,
    useRStateS,
    stateArray,
    useRStateArray,
    create,
    createS,
    createProvider,
    hooks,
    watch,
    link,
    view,
    unstable_disableDelay,
};
export type { HooksRef, WatchOptions, Watcher, State, StateS, StateLink, Context, StateArray, StateArrayItem };
export { setDebugComponentName };
