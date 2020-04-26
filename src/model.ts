import { DefaultProps } from './common';

export interface StateV<T> {
    value: T;
}

export interface Context<T> {
    readonly debugName: string;
    // if the component is unmounted, active is false.
    active: boolean;
    // used as the props parameter of the render function.
    readonly props: T;
    // set defaultProps in setup function which can then be used as the default property values of the component.
    defaultProps: DefaultProps<T>;
    // used for watching the props of the current component. eg. ctx.w().prop1
    w(): T;
    // the cb functions will be called when the component is about to be unmounted.
    onDispose(cb: () => void): void;
    // force to update the view
    forceUpdate(): void;
}

// -- compare: compare new values with old values, if they are the same, don't call the callback function, otherwise, call it.
//    -- The default value is true, which means always do comparison.
//    -- If compare is false, don't compare two values, just call the callback function directly.
// -- global: call watch function outside of any component.
//    -- often used for debugging, or within a watch function, it can change other global state* or global variables.
export interface WatchOptions {
    compare?: boolean;
    global?: boolean;
}

export interface Watcher {
    readonly active: boolean;
    readonly debugName: string;
    unwatch(): void;
}
