import { createS } from './func';
import React, { ReactNode } from 'react';

const _Watcher = createS<{
    render: () => ReactNode;
}>((props) => {
    return props.render() as any;
});

export function view(render: () => ReactNode) {
    return <_Watcher render={render} />;
}
