import * as React from 'react';
import { create, state, stateV, link, watch, stateLongArray, LongArrayItem, setDebugComponentName, cache, useHooks, LongArray, StateV } from 'rt-state';
import { useState } from 'react';

const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const gState = state({ count: 0, num: { v1: 0, v2: 100 } });

const gWatcher = watch(
    (values, oldValues) => {
        // console.log('globally shared data changed:', JSON.stringify(values));
    },
    () => [gState.count, gState.num],
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
                <TestBatchUpdateComp />
                <UseHookComp />
                <ForceUpdateComp stateFromParent={dataForForceUpdateComp} />
                <ArrComp />
                <LongArrayComp />
                <br />
            </div>
        );
    };
});

export const ForceUpdateComp = create<{ stateFromParent: { parentNum: number } }>((ctx) => {
    setDebugComponentName('ForceUpdateComp');
    console.log(`${ctx.debugName} setup`);

    let nonReactiveData;
    watch(
        () => {
            nonReactiveData = ctx.props.stateFromParent.parentNum * 100 + 10;
            if (nonReactiveData > 300 && nonReactiveData < 600) {
                console.log(`nonReactiveData:${nonReactiveData}, the view will not be updated util nonReactiveData > 600`);
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

export const UseHookComp = create((ctx) => {
    setDebugComponentName('UseHookComp');
    console.log(`${ctx.debugName} setup`);

    let num, setNum;
    useHooks(() => {
        // This callback function will be called again and again before rendering the component.
        [num, setNum] = useState(666);
        if (num >= 670 && num <= 675) {
            return false;
        }
    });

    const addOne = () => {
        setNum(num + 1);
    };

    return () => {
        console.log(`${ctx.debugName} render`);
        return (
            <div>
                UseHookComp <button onClick={addOne}>add</button>&nbsp;
                <span>
                    num:{num} {' must not in [670, 675]'}
                </span>
            </div>
        );
    };
});
// only render it once. so, it already takes advantage of react async batch rendering, which can combine multiple updates into one.
const TestBatchUpdateComp = create((ctx) => {
    setDebugComponentName('TestBatchUpdateComp');
    console.log(`${ctx.debugName} setup`);
    const data = stateV(100);
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
                <CacheComp name={'CacheComp'} val={666} />
            </div>
        );
    };
});

const CacheComp = cache<{ name: string; val: number }>(({ name, val }) => {
    console.log('CacheComp render');
    return (
        <span>
            &nbsp;
            {name} name:{val}
        </span>
    );
});

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
            console.log(`ShowNumField watch done: ${ctx.active} ${watcher.active}: ${ctx.props.numV1}  ${ctx.props.numV2}`);
        },
        () => [ctx.w().numV1],
    );

    // unwatch(watcher);

    ctx.onDispose(() => {
        console.log(`${ctx.debugName} teardown: ${ctx.props.numV1}  ${ctx.props.numV2} `);
    });
    return (props) => {
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
                <ShowCountStateVChild name={'ShowCountStateVChild'} />
            </div>
        );
    };
});

const ShowCountStateVChild = create<{ name: string }>((ctx) => {
    setDebugComponentName('ShowCountStateVChild');
    console.log(`${ctx.debugName} setup`);

    const one = stateV(100);
    const two = stateV(200);
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
    const doublePlusCount: StateV<number> = link(
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
                        const v = doublePlusCount.value;
                        doublePlusCount.value = v;
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
    const arr = stateV([]);
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
                        arr.value = [...arr.value];
                    }}>
                    add to arr
                </button>
                <button
                    onClick={() => {
                        arr.value.pop();
                        arr.value = [...arr.value];
                    }}>
                    delete from arr
                </button>
                <button
                    onClick={() => {
                        gKey += 100;
                        arr.value[1] = gKey;
                        arr.value = [...arr.value];
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
    const arr = stateLongArray<number>([]);

    // Optimized
    let filteredArr: LongArray<number>;
    const watcher = watch(
        (values) => {
            filteredArr = arr.filterItems((item) => item.value !== 102);
            ctx.forceUpdate();
        },
        () => [arr.length],
    );

    console.log('watcher debug name:', watcher.debugName);

    const LongArrayItemComp = create<{ item: LongArrayItem<number> }>((childCtx) => {
        setDebugComponentName('LongArrayItemComp');
        const itemValue = childCtx.props.item.value;
        console.log(`${childCtx.debugName} ${itemValue} setup`);

        childCtx.onDispose(() => {
            console.log(`${childCtx.debugName} ${itemValue} teardown`);
        });

        return (props) => {
            console.log(`${childCtx.debugName} ${props.item.value} render`);
            return <span>{props.item.value}&nbsp;</span>;
        };
    });

    return () => {
        // console.log('LongArrayComp render', JSON.stringify(arr.value));
        console.log(`${ctx.debugName} render`);
        return (
            <>
                <br />
                LongArrayComp &nbsp;
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

const DefaultPropsComp = create<{ v1: number; v2?: number }>((ctx) => {
    ctx.defaultProps = {
        v2: 1003,
    };
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
});
