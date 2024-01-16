import * as React from 'react';

import { DemoBatchReRender, DemoCreateS, DemoDefaultProps } from '../demo/demo-create';

export default { title: 'demo-create' };

export const CreateS = {
    name: 'DemoCreateS',
    render: () => <DemoCreateS />,
};
export const DefaultProps = {
    name: 'DemoDefaultProps',
    render: () => <DemoDefaultProps x={60} />,
};
export const BatchReRender = {
    name: 'DemoBatchReRender',
    render: () => <DemoBatchReRender />,
};
