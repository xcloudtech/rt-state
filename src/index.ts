import { create, createS, useHooks, watch, link, setDebugComponentName } from './func';
import { state, stateV, batchUpdate } from './core';
import { StateV, Context, Watcher, WatchOptions } from './model';
import { stateLongArray, LongArray, LongArrayItem } from './long_array';

export { state, stateV, stateLongArray, create, createS, useHooks, watch, link, batchUpdate };
export type { WatchOptions, Watcher, StateV, Context, LongArray, LongArrayItem };
export { setDebugComponentName };
