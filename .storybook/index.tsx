import React from 'react';
import { storiesOf } from '@storybook/react';
import { DemoLink } from '../src/demo/demo-link';
import { DemoBatchReRender, DemoCreateS, DemoDefaultProps } from '../src/demo/demo-create';
import { DemoGlobalStateAndWatcher } from '../src/demo/demo-global';
import { DemoHooks } from '../src/demo/demo-hooks';
import { DemoLongArray } from '../src/demo/demo-long-array';
import { DemoNormalArray } from '../src/demo/demo-normal-array';
import { DemoProviderContainer, DemoProviderWithUseContainer, DemoProviderWithWatch } from '../src/demo/demo-provider';
import { DemoUseRState, DemoUseRStateCreateSWrapper, DemoUseRStateS } from '../src/demo/demo-view';
import { DemoDisableDelay, DemoWatch } from '../src/demo/demo-watch';

const EmptyNode = <div>Empty! Please see the code directly.</div>;

storiesOf('demo-create', module)
    .add('DemoCreateS', () => <DemoCreateS />)
    .add('DemoDefaultProps', () => <DemoDefaultProps x={60} />)
    .add('DemoBatchReRender', () => <DemoBatchReRender />);

storiesOf('demo-view', module)
    .add('DemoUseRState', () => <DemoUseRState />)
    .add('DemoUseRStateCreateSWrapper', () => <DemoUseRStateCreateSWrapper />)
    .add('DemoUseRStateS', () => <DemoUseRStateS />);

storiesOf('demo-state', module)
    .add('DemoState', () => EmptyNode)
    .add('separate DemoState', () => EmptyNode)
    .add('DemoStateS', () => EmptyNode)
    .add('DemoSetState', () => EmptyNode)
    .add('DemoShowBadCase', () => EmptyNode)
    .add('state extract', () => EmptyNode);

storiesOf('demo-watch', module)
    .add('DemoWatch', () => <DemoWatch />)
    .add('DemoWatchProps', () => EmptyNode)
    .add('DemoWatchExternalState', () => EmptyNode)
    .add('DemoDisableDelay', () => <DemoDisableDelay />);

storiesOf('demo-link', module).add('DemoLink', () => <DemoLink />);

storiesOf('demo-provider', module)
    .add('DemoProviderContainer', () => <DemoProviderContainer />)
    .add('DemoProviderWithWatch', () => <DemoProviderWithWatch />)
    .add('DemoProviderWithUseContainer', () => <DemoProviderWithUseContainer />);

storiesOf('demo-global', module).add('DemoGlobalStateAndWatcher', () => <DemoGlobalStateAndWatcher />);

storiesOf('demo-hooks', module).add('DemoHooks', () => <DemoHooks />);

storiesOf('demo-normal-array', module).add('DemoNormalArray', () => <DemoNormalArray />);

storiesOf('demo-long-array', module).add('DemoLongArray', () => <DemoLongArray />);
