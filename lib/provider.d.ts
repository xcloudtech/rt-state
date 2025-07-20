import * as React from 'react';
import { Provider } from './model';
export declare function createProvider<T, I>(setup: (initValue: I) => T): Provider<T, I>;
export declare function _provide<T extends object>(Comp: React.FC<T>, providers: Provider<any, any>[]): React.NamedExoticComponent<T>;
