import { createS } from './func';
import * as React from 'react';
import { ReactNode } from 'react';

const _Watcher = createS<{
    render: () => ReactNode;
}>((props) => {
    return props.render() as any;
});

export function view(render: () => ReactNode) {
    return <_Watcher render={render} />;
}
