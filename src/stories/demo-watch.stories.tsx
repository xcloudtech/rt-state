import * as React from 'react';
import { DemoDisableDelay, DemoWatch } from '../demo/demo-watch';

export default { title: 'demo-watch' };

const EmptyNode = <div>Empty! Please see the code directly.</div>;

export const XDemoWatch = {
    name: 'DemoWatch',
    render: () => <DemoWatch />,
};

export const DemoWatchProps = {
    name: 'DemoWatchProps',
    render: () => EmptyNode,
};
export const DemoWatchExternalState = {
    name: 'DemoWatchExternalState',
    render: () => EmptyNode,
};

export const XDemoDisableDelay = {
    name: 'DemoDisableDelay',
    render: () => <DemoDisableDelay />,
};
