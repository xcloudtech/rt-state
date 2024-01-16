import * as React from 'react';
import { DemoProviderContainer, DemoProviderWithUseContainer, DemoProviderWithWatch } from '../demo/demo-provider';

export default { title: 'demo-provider' };
export const ProviderContainer = {
    name: 'DemoProviderContainer',
    render: () => <DemoProviderContainer />,
};
export const ProviderWithWatch = {
    name: 'DemoProviderWithWatch',
    render: () => <DemoProviderWithWatch />,
};
export const ProviderWithUseContainer = {
    name: 'DemoProviderWithUseContainer',
    render: () => <DemoProviderWithUseContainer />,
};
