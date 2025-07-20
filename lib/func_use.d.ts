import { StateS, StateOptions } from './model';
import { Target } from './common';
import { StateArray } from './long_array';
export declare function useRStateS<T>(initValue?: T): StateS<T>;
export declare function useRState<T extends Target>(initValue: T, options?: StateOptions): T;
export declare function useRStateArray<T>(initValues?: T[]): StateArray<T>;
export declare function useOnce<T>(initFunc: () => T): T;
