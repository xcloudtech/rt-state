import * as React from 'react';
import { useRef, useState } from 'react';
import {
    create,
    state,
    link,
    watch,
    stateArray,
    StateArrayItem,
    setDebugComponentName,
    createS,
    hooks,
    StateArray,
    createProvider,
    useRState,
    view,
    rst,
    stateS,
    useRStateS,
    HooksRef,
    extract,
    StateS,
    StateLink,
} from '../';

const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const gState = rst.state({ count: 0, num: { v1: 0, v2: 100 } });

const gWatcher = watch(
    (values, oldValues) => {
        // console.log('globally shared data changed:', JSON.stringify(values));
    },
    () => [gState.count, gState.num],
    { global: true },
);

export const ReactiveDemo = create((ctx) => {
    setDebugComponentName('App');
    console.log(`${ctx.debugName} setup`);
    const dataForForceUpdateComp = state({ parentNum: 0 });
    // watch(async (values, oldValues) => {
    //     console.log(`values:`, values, `oldValues:`, oldValues);
    //     // await delay(3000);
    //     // if (!ctx.active) {
    //     //     console.log('is inactive');
    //     //     return;
    //     // }
    //     // data.count++;
    //   }, () => [data.count, data.num]
    // );

    console.log('gWatcher debugName:', gWatcher.debugName);

    return () => {
        console.log(`${ctx.debugName} render`);
        return (
            <div>
                {/*<div>{JSON.stringify(gState.num)}</div>*/}
                <UseRStateSComp style={{ backgroundColor: 'green' }} />
                <StateSComp />
                <UseRStateComp />
                <ProviderDemoComp />
                <WatchAndBatchUpdateTestComp />
                <ReactBuiltinBatchUpdateComp />
                <ShowCountParent />
                <button
                    onClick={() => {
                        gState.count++;
                        gState.num.v1 += 1;
                        // trigger an update of the view
                        // gState.num = gState.num;
                        gState.num = { ...gState.num };
                        // data.num.v2 += 100;s
                    }}>
                    +
                </button>
                <ShowNumField numV1={gState.num.v1} numV2={gState.num.v2} />
                <NestedParentComp />
                <ShowNum data={gState} />
                <DefaultPropsComp v1={2} />
                <HookComp />
                <ForceUpdateComp stateFromParent={dataForForceUpdateComp} />
                <ArrComp />
                <LongArrayComp />
                <br />
            </div>
        );
    };
});

const StateSComp = create((ctx) => {
    setDebugComponentName('StateSComp');
    console.log(`${ctx.debugName} setup`);

    const state = stateS({ v1: 0, v2: 0 });
    const addByForceUpdate = () => {
        const { value } = state;
        value.v1 += 1;
        value.v2 += 1;
        state.forceUpdate();
    };
    const justAdd = () => {
        state.value.v1 += 100;
        state.value.v2 += 100;
        // throw an exception
        // state.value['ddd'] = 3;
    };

    return (props) => {
        const { value: data } = state;
        console.log(`StateSComp render: ${data.v1} ${data.v2}`);
        return (
            <div>
                v1: {data.v1}&nbsp;v2:{data.v2}
                <button onClick={addByForceUpdate}>addByForceUpdate</button>
                <button onClick={justAdd}>justAdd</button>
            </div>
        );
    };
});

const UseRStateSComp = createS((props) => {
    console.log('UseRStateSComp render');

    const state = rst.useRStateS({ x: 30 });
    const { value: data } = state;

    const reactiveNode = rst.view(() => {
        console.log(`UseRStateSComp view is reactive: ${data.x}`);
        return <div>UseRStateSComp reactive: {data.x}</div>;
    });

    function add() {
        data.x += 100;
        state.forceUpdate();
    }

    return (
        <div style={props.style} className={props.className}>
            <button onClick={add}>add</button>
            {reactiveNode}
        </div>
    );
});

const UseRStateComp = createS(() => {
    console.log('UseRStateComp render');

    const data = rst.useRState({ x: 30, y: 55 });
    const dataS = useRStateS(60);

    const reactiveNode = rst.view(() => {
        console.log(`UseRStateComp view is reactive: ${data.x}`);
        console.log(extract(data));
        return <div>UseRStateComp reactive: {data.x}</div>;
    });

    function add() {
        data.x++;
        dataS.value++;
    }

    return (
        <div>
            <button onClick={add}>add</button>
            {/*<div>no reactive: {(data)}</div>*/}
            {reactiveNode}
            <UseRTStateShowComp data={data} dataS={dataS} />
        </div>
    );
});

const UseRTStateShowComp = createS<{
    data: { x: number };
    dataS: { value: number };
}>((props) => {
    console.log('UseRTStateShowComp render');
    return (
        <span>
            {props.data.x} {props.dataS.value}
        </span>
    );
});

//////////////////////////

const globalX = (() => {
    const x = stateS(100);
    const add = () => x.value++;
    return { x, add };
})();

const ProviderX = createProvider((initValue: number) => {
    const x = stateS(initValue ?? 0);
    rst.watch(
        (values, oldValues) => {
            console.log('x has changed:', values, oldValues);
        },
        () => [x.value],
    );
    const add = () => x.value++;
    return { x, add };
});
const ProviderV = createProvider(() => {
    const x = stateS(200);
    const add = () => x.value++;
    return { x, add };
});

const ProviderDemoComp = createS(
    () => {
        const [state, setstate] = useState(0);
        return (
            <>
                <button onClick={() => setstate(state + 1)}> add one </button>
                {state % 5 === 0 ? null : <ProviderDemoParentComp />}

                <ProviderDemoParentComp />
            </>
        );
    },
    { providers: [] },
);

const ProviderDemoParentComp = createS(
    (props) => {
        const providerX = ProviderX.use();
        const providerV = ProviderV.use();
        function addAll() {
            globalX.add();
            providerX.add();
            providerV.add();
        }
        console.log(`ProviderDemoParentComp render`);
        return (
            <>
                <button onClick={addAll}>addAll</button>
                <span>vv:{providerV.x.value}</span>
                <ProviderDemoChildComp />
            </>
        );
    },
    { providers: [ProviderX.init(999999), ProviderV] },
);

const ProviderDemoChildComp = create((ctx) => {
    setDebugComponentName('ProviderDemoChildComp');
    console.log(`${ctx.debugName} setup`);
    const providerX = ProviderX.use();
    const providerV = ProviderV.use();
    // hooks(() => {
    //     console.log('use Hooks');
    //     const ref = useRef(1);
    // });

    return (props) => {
        const [x, setX] = useState(777);
        function addX() {
            setX(x + 1);
        }

        console.log(`${ctx.debugName} render`);
        return (
            <>
                <button onClick={addX}>addX</button>&nbsp;
                <span style={props.style}>{x}</span>
                <div>
                    <button onClick={globalX.add}>addToGlobalX</button>
                    {globalX.x.value}
                </div>
                <div>
                    <button onClick={providerX.add}>addToProviderX</button>
                    {providerX.x.value}
                </div>
                <div>
                    <button onClick={providerV.add}>addToProviderV</button>
                    {providerV.x.value}
                </div>
            </>
        );
    };
});
//////////////////////////

const WatchAndBatchUpdateTestComp = create((ctx) => {
    setDebugComponentName('WatchAndBatchUpdateTestComp');
    console.log(`${ctx.debugName} setup`);
    const data = state({ v1: 0, v2: 100 });
    let sum;

    watch(
        (values) => {
            console.log('watch 1');
            const newSum = values[0];
            // console.log('newSum:', newSum);
            if (newSum !== sum) {
                sum = newSum;
                ctx.forceUpdate();
            }
        },
        () => [data.v1 + data.v2],
    );

    watch(
        (values) => {
            console.log('watch 2');
        },
        () => [data.v1, data.v2],
    );

    const change = () => {
        console.log('change begin');
        let i = 1;
        while (i < 10000) {
            data.v1 += 1;
            data.v2 -= 1;
            i++;
        }
        console.log('change done: call watch 2 only, and only once.');
    };

    return () => {
        console.log(`${ctx.debugName} render`);
        return (
            <div>
                {ctx.debugName}&nbsp;
                <button onClick={change}>Watch and Batch Update</button>
                &nbsp;sum: {sum}
            </div>
        );
    };
});

const ForceUpdateComp = create<{ stateFromParent: { parentNum: number } }>((ctx) => {
    setDebugComponentName('ForceUpdateComp');
    console.log(`${ctx.debugName} setup`);

    let nonReactiveData;
    watch(
        () => {
            nonReactiveData = ctx.props.stateFromParent.parentNum * 100 + 10;
            if (nonReactiveData > 300 && nonReactiveData < 600) {
                console.log(
                    `nonReactiveData:${nonReactiveData}, the view will not be updated util nonReactiveData > 600`,
                );
                return;
            }
            ctx.forceUpdate();
        },
        () => [ctx.w().stateFromParent.parentNum],
    );
    return (props) => {
        console.log(`${ctx.debugName} render`);
        // This view doesn't depend on 'data.num', it won't change when data.num changes.
        // so, we need 'ctx.forceUpdate'.
        return (
            <div>
                <button
                    onClick={() => {
                        props.stateFromParent.parentNum++;
                    }}>
                    add
                </button>
                &nbsp;nonReactiveData:&nbsp;{nonReactiveData}
            </div>
        );
    };
});

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

const HookComp = create((ctx) => {
    setDebugComponentName('HookComp');
    console.log(`${ctx.debugName} setup`);
    const hooksRef = hooks(() => {
        //// can't use watch here!
        // watch(
        //     () => {
        //         console.log(gState.num);
        //     },
        //     () => [gState.num],
        // );

        // This callback function will be called again and again before rendering the component.
        console.log('Call hooks');
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
        console.log(`${ctx.debugName} render`);
        return (
            <div>
                {ctx.debugName}: <br />
                <button onClick={sCtx.addOne}>add1</button>&nbsp;
                <button onClick={sCtx.add100}>add100</button>&nbsp;
                <br />
                <span>num: {hooksRef.current.num}</span>
            </div>
        );
    };
});
// only render it once. so, it already takes advantage of react async batch rendering, which can combine multiple updates into one.
const ReactBuiltinBatchUpdateComp = create((ctx) => {
    setDebugComponentName('TestBatchUpdateComp');
    console.log(`${ctx.debugName} setup`);
    const data = stateS(100);
    return () => {
        console.log(`${ctx.debugName} render`);
        return (
            <div>
                TestBatchUpdateComp&nbsp;
                <button
                    onClick={() => {
                        Array.from({ length: 1000 }, (v, k) => k).forEach((v) => {
                            data.value += v;
                        });
                    }}>
                    add
                </button>
                &nbsp;
                {data.value}
                <CreateSimpleComp name={'SimpleComp1'} val={data.value} />
                <CreateSimpleComp name={'SimpleComp2'} />
            </div>
        );
    };
});

const CreateSimpleComp = createS<{ name: string; val?: number }>(
    ({ name, val }) => {
        console.log(`${name} render`);
        // don't create local state in render function, because although the state change could trigger the re-rendering of this component, it will be redefined during each rendering, so its value will stay the same as the initial value.
        const data = state({ num: 11 });
        // // "watch" can not be called in the render function.
        // watch(
        //     () => console.log('break!'),
        //     () => [null],
        // );
        // // can't call hooks in the render function.
        // hooks(() => {
        //     console.log('break');
        // });
        return (
            <span>
                &nbsp;
                <button onClick={() => data.num++}>add</button>
                {name} name:{val} data:{data.num}(will not change)
            </span>
        );
    },
    {
        defaultProps: {
            val: 1000000,
        },
    },
);

const ShowNumField = create<{ numV1: number; numV2: number }>((ctx) => {
    setDebugComponentName('ShowNumField');
    console.log(`${ctx.debugName} setup: ${ctx.props.numV1} ${ctx.props.numV2}`);

    const watcher = watch(
        async () => {
            if (ctx.props.numV1 > 3) {
                console.log('unwatch');
                watcher.unwatch();
                return;
            }
            console.log(`ShowNumField watch start: ${ctx.props.numV1}  ${ctx.props.numV2}...`);
            await delay(2000);
            console.log(
                `ShowNumField watch done: ${ctx.active} ${watcher.active}: ${ctx.props.numV1}  ${ctx.props.numV2}`,
            );
        },
        () => [ctx.w().numV1],
    );

    // unwatch(watcher);

    ctx.onDispose(() => {
        console.log(`${ctx.debugName} teardown: ${ctx.props.numV1}  ${ctx.props.numV2} `);
    });
    return (props) => {
        // // "onDispose" can only be called within the setup function of the current component.
        // ctx.onDispose(() => {
        //     console.log('break!');
        // });
        // // "watch" can not be called in the render function.
        // watch(
        //     () => console.log('break!'),
        //     () => [null],
        // );
        console.log(`${ctx.debugName} render: ${props.numV1}  ${props.numV2} `);
        return (
            <div>
                ShowNumField: {props.numV1} {props.numV2}
            </div>
        );
    };
});

const ShowNum = create<{ data: { num: { v1: number; v2: number } } }>((ctx) => {
    setDebugComponentName('ShowNum');
    console.log(`${ctx.debugName}: setup`);

    return (props) => {
        console.log('ShowNum render');
        return <div>ShowNum:{JSON.stringify(props.data.num)}</div>;
    };
});

const ShowCountParent = create((ctx) => {
    setDebugComponentName('ShowCountParent');
    console.log(`${ctx.debugName} setup`);

    return () => {
        console.log(`${ctx.debugName} render`);
        return (
            <>
                <div>good</div>
                <ShowCount name={'ShowCount'} />
            </>
        );
    };
});

const ShowCount = create<{ name: string }>((ctx) => {
    setDebugComponentName('ShowCount');
    console.log(`${ctx.debugName} setup`);

    return (props) => {
        const { count } = gState;
        console.log(`${ctx.debugName}: render`);
        return (
            <div>
                {props.name}: {count}
                <ShowCountChild name={'ShowCountChild'} count={null} />
                <ShowCountLinkChild />
                <ShowCountStateSChild name={'ShowCountStateSChild'} />
            </div>
        );
    };
});

const ShowCountStateSChild = create<{ name: string }>((ctx) => {
    setDebugComponentName('ShowCountStateSChild');
    console.log(`${ctx.debugName} setup`);

    const one = stateS(100);
    const two = stateS(200);
    const third = state({ val: 300 });

    const plusOne = () => {
        one.value++;
    };
    watch(
        () => {
            console.log('one:', one.value);
        },
        () => [one.value],
    );

    return (props) => {
        console.log(`${ctx.debugName} render`);

        return (
            <div>
                <span>{props.name}</span>&nbsp;&nbsp;
                <span>{one.value}</span> &nbsp;&nbsp;
                <span>{two.value}</span>&nbsp;&nbsp;
                <span>{third.val}</span>&nbsp;&nbsp;
                <button onClick={plusOne}>add</button>
            </div>
        );
    };
});

const ShowCountChild = create<{ name: string; count: number }>((ctx) => {
    setDebugComponentName('ShowCountChild');
    console.log(`${ctx.debugName} setup`);

    return (props) => {
        console.log(`${ctx.debugName} render`);
        return (
            <>
                <div>
                    name:{props.name} {props.count}
                </div>
            </>
        );
    };
});

const ShowCountLinkChild = create((ctx) => {
    setDebugComponentName('ShowCountLinkChild');
    console.log(`${ctx.debugName} setup`);

    const doubleCount = link<number>(() => gState.count * 2);
    const doublePlusCount: StateLink<number> = link(
        () => doubleCount.value + 1000,
        (newValue) => {
            gState.count = newValue;
        },
    );
    return (props) => {
        console.log(`${ctx.debugName} render`);
        return (
            <>
                <div>
                    ShowCountLinkChild: count:{gState.count} doublePlusCount:
                    {doublePlusCount.value}
                </div>
                <button
                    onClick={() => {
                        // should update value
                        doublePlusCount.value = doublePlusCount.value;
                        console.log('value is updated!');
                    }}>
                    linkAdd
                </button>
            </>
        );
    };
});

const NestedParentComp = create((ctx) => {
    setDebugComponentName('NestedParentComp');
    console.log(`${ctx.debugName} setup`);

    const ps = state({ v: 10 });
    const NestedChildComp = create((childCtx) => {
        setDebugComponentName('NestedChildComp');
        console.log(`${childCtx.debugName} setup`);
        const cs = state({ v: 100 });

        return () => {
            console.log(`${childCtx.debugName} render`);
            return (
                <>
                    <div>{cs.v} </div>
                    <button
                        onClick={() => {
                            cs.v++;
                            gState.count++;
                        }}>
                        add
                    </button>
                </>
            );
        };
    });

    return () => {
        console.log(`${ctx.debugName} render`);
        return (
            <>
                <NestedChildComp />
                <div>{ps.v}</div>
                <button onClick={() => ps.v++}>add</button>
            </>
        );
    };
});

const ArrComp = create((ctx) => {
    setDebugComponentName('ArrComp');
    console.log(`${ctx.debugName} setup`);

    let gKey = 100;
    const arr = stateS([]);
    const ItemComp = create<{ item: number }>((childCtx) => {
        setDebugComponentName('ItemComp');
        console.log(`${childCtx.debugName} ${childCtx.props.item} setup`);

        return (props) => {
            console.log(`${childCtx.debugName} ${props.item} render`);
            return <span>{props.item}&nbsp;</span>;
        };
    });

    return () => {
        console.log(`${ctx.debugName} render`);
        return (
            <>
                <br />
                ArrComp &nbsp;
                <button
                    onClick={() => {
                        arr.value.push(gKey++);
                        arr.forceUpdate();
                    }}>
                    add to arr
                </button>
                <button
                    onClick={() => {
                        arr.value.pop();
                        arr.forceUpdate();
                    }}>
                    delete from arr
                </button>
                <button
                    onClick={() => {
                        gKey += 100;
                        arr.value[1] = gKey;
                        arr.forceUpdate();
                        gKey += 1;
                    }}>
                    change second item
                </button>
                <button
                    onClick={() => {
                        arr.value = [];
                    }}>
                    reset
                </button>
                <br />
                {arr.value.map((v, idx) => (
                    <ItemComp key={idx} item={v} />
                ))}
            </>
        );
    };
});

const LongArrayComp = create((ctx) => {
    setDebugComponentName('LongArrayComp');
    console.log(`${ctx.debugName} setup`);

    let gKey = 100;
    const arr = stateArray<number>([]);

    // Optimized
    let filteredArr: StateArray<number>;
    const watcher = watch(
        (values) => {
            filteredArr = arr.filterItems((item) => item.value !== 102);
            ctx.forceUpdate();
        },
        () => [arr.items],
    );

    console.log('watcher debug name:', watcher.debugName);

    return () => {
        // console.log('LongArrayComp render', JSON.stringify(arr.value));
        console.log(`${ctx.debugName} render`);
        return (
            <>
                <br />
                LongArrayComp &nbsp;
                {rst.view(() => {
                    // watch the change of both arr and its items.
                    const v = arr.values;
                    console.log('view render: watch arr and its items.');
                    return <span />;
                })}
                <button onClick={() => arr.forceUpdate()}>forceUpdate arr</button>
                <button onClick={() => filteredArr.forceUpdate()}>forceUpdate filteredArr</button>
                <br />
                <button onClick={() => arr.push(gKey++)}>add to arr</button>
                <button onClick={() => arr.pop()}>delete from arr</button>
                <button
                    onClick={() => {
                        gKey += 100;
                        arr.set(1, gKey);
                        gKey += 1;
                    }}>
                    change second item
                </button>
                <button onClick={() => (arr.values = [])}>reset</button>
                <button onClick={() => arr.add(2, gKey++, gKey++)}>add two at index 2</button>
                <button onClick={() => arr.remove(1, 2)}>remove two at index 1</button>
                <br />
                {filteredArr.mapItems((item, idx) => {
                    // Optimized: it should be faster than using filterItems directly here.
                    // Because if you use 'item.value', this view will depends on all items.
                    return <LongArrayItemComp key={item.key} item={item} />;
                })}
            </>
        );
    };
});

const LongArrayItemComp = create<{ item: StateArrayItem<number> }>((childCtx) => {
    setDebugComponentName('LongArrayItemComp');
    const itemValue = childCtx.props.item.value;
    console.log(`${childCtx.debugName} ${itemValue} setup`);

    childCtx.onDispose(() => {
        console.log(`${childCtx.debugName} ${itemValue} teardown`);
    });

    return (props) => {
        console.log(`${childCtx.debugName} ${props.item.value} render`);
        return <button onClick={() => props.item.forceUpdate()}>item:{props.item.value}&nbsp;</button>;
    };
});

const DefaultPropsComp = create<{ v1: number; v2?: number }>(
    (ctx) => {
        setDebugComponentName('DefaultPropsComp');
        console.log(`${ctx.debugName} setup: ${ctx.props.v1} ${ctx.props.v2}`);

        return (props) => {
            console.log(`${ctx.debugName} render`);
            return (
                <div>
                    {ctx.debugName}:{props.v1} {props.v2}
                </div>
            );
        };
    },
    { defaultProps: { v2: 1003 } },
);
