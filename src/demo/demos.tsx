import * as React from 'react';
import { rst } from '../';
import { DemoLongArray } from './demo-long-array';
import { DemoBatchReRender, DemoCreateS, DemoDefaultProps } from './demo-create';
import { DemoGlobalStateAndWatcher } from './demo-global';
import { DemoHooks } from './demo-hooks';
import { DemoLink } from './demo-link';
import { DemoNormalArray } from './demo-normal-array';
import { DemoProviderContainer, DemoProviderWithUseContainer, DemoProviderWithWatch } from './demo-provider';
import { DemoUseRState, DemoUseRStateCreateSWrapper, DemoUseRStateS } from './demo-view';
import { DemoDisableDelay, DemoWatch } from './demo-watch';

const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const ReactiveDemo = rst.create((ctx) => {
    rst.setDebugComponentName('App');
    console.log(`${ctx.debugName} setup`);

    return () => {
        console.log(`${ctx.debugName} render`);
        return (
            <div>
                <h1>......demo-create......</h1>
                <h3>DemoCreateS</h3>
                <DemoCreateS />
                <h3>DemoDefaultProps</h3>
                <DemoDefaultProps x={60} />
                <h3>DemoBatchReRender</h3>
                <DemoBatchReRender />
                <h1>......demo-global......</h1>
                <h3>DemoGlobalStateAndWatcher</h3>
                <DemoGlobalStateAndWatcher />
                <h1>......demo-hooks......</h1>
                <h3>DemoHooks</h3>
                <DemoHooks />
                <h1>......demo-link......</h1>
                <h3>DemoLink</h3>
                <DemoLink />
                <h1>......demo-long-array......</h1>
                <h3>DemoLongArray</h3>
                <DemoLongArray />
                <h1>......demo-normal-array......</h1>
                <h3>DemoNormalArray</h3>
                <DemoNormalArray />
                <h1>......demo-provider......</h1>
                <h3>DemoProviderContainer</h3>
                <DemoProviderContainer />
                <h3>DemoProviderWithWatch</h3>
                <DemoProviderWithWatch />
                <h3>DemoProviderWithUseContainer</h3>
                <DemoProviderWithUseContainer />
                <h1>......demo-state......</h1>
                <h1>......demo-view......</h1>
                <h3>DemoUseRState</h3>
                <DemoUseRState />
                <h3>DemoUseRStateCreateSWrapper</h3>
                <DemoUseRStateCreateSWrapper />
                <h3>DemoUseRStateS</h3>
                <DemoUseRStateS />
                <h1>......demo-watch......</h1>
                <h3>DemoWatch</h3>
                <DemoWatch />
                <h3>DemoWatchProps</h3>
                <h3>DemoWatchExternalState</h3>
                <h3>DemoDisableDelay</h3>
                <DemoDisableDelay />
            </div>
        );
    };
});

//////////////////////////
