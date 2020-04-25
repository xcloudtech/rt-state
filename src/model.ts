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

export interface Watcher {
    readonly active: boolean;
    readonly debugName: string;
    unwatch(): void;
}
