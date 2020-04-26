import { create, createS, useHooks, watch, link, setDebugComponentName } from './func';
import { state, stateV } from './core';
import { StateV, Context, Watcher, WatchOptions } from './model';
import { stateLongArray, LongArray, LongArrayItem } from './long_array';

export { state, stateV, stateLongArray, create, createS, useHooks, watch, link };
export type { WatchOptions, Watcher, StateV, Context, LongArray, LongArrayItem };
export { setDebugComponentName };
