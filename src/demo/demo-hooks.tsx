import { useState } from 'react';
import * as React from 'react';
import { HooksRef, rst } from '../';

const hookCompSetup = (hooksRef: HooksRef<any>) => {
    const addOne = () => {
        const ref = hooksRef.current;
        ref.setNum(ref.num + 1);
    };
    const add100 = () => {
        const ref = hooksRef.current;
        ref.setNum(ref.num + 100);
    };
    return { addOne, add100 };
};

export const DemoHooks = rst.create<{
    hooksCallCount?: () => void;
}>((ctx) => {
    const hooksRef = rst.hooks(() => {
        ctx.props.hooksCallCount?.();
        //// can't use watch here!
        // watch(
        //     () => {
        //         console.log(gState.num);
        //     },
        //     () => [gState.num],
        // );

        // This callback function will be called again and again before rendering the component.
        const [num, setNum] = useState(666);
        return { num, setNum };
    });

    // // can't use "hooks" again, just wrap all your use* functions within one "hooks" callback.
    // hooks(() => {
    //     useState();
    // });

    const sCtx = hookCompSetup(hooksRef);

    return () => {
        // // can't use "hooks" in render function.
        // hooks(() => {
        //     useState();
        // });

        return (
            <div>
                <button data-testid="add1" onClick={sCtx.addOne}>
                    add1
                </button>
                &nbsp;
                <button data-testid="add100" onClick={sCtx.add100}>
                    add100
                </button>
                &nbsp;
                <br />
                <span data-testid="num">num:({hooksRef.current.num})</span>
            </div>
        );
    };
});
