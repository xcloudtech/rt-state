import * as React from 'react';
import { DemoSetState } from '../demo/demo-state';

const EmptyNode = <div>Empty! Please see the code directly.</div>;

export default { title: 'demo-state' };

export const DemoState = {
    name: 'DemoState',
    render: () => EmptyNode,
};
export const SeparateDemoState = {
    name: 'separate DemoState',
    render: () => EmptyNode,
};
export const DemoStateS = {
    name: 'DemoStateS',
    render: () => EmptyNode,
};
export const XDemoSetState = {
    name: 'DemoSetState',
    render: () => <DemoSetState />,
};

export const DemoShowBadCase = {
    name: 'DemoShowBadCase',
    render: () => EmptyNode,
};
export const DemoStateExtract = {
    name: 'state extract',
    render: () => EmptyNode,
};
