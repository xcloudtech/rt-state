import { createS } from './func';
import * as React from 'react';
import { ReactNode } from 'react';

const View = createS<{
    render: () => ReactNode;
}>((props) => {
    return props.render() as any;
});

export function view(render: () => ReactNode) {
    return <View render={render} />;
}
