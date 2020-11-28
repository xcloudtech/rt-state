import * as React from 'react';
import { rst } from '../';

export const DemoLongArray = rst.create<{
    callCount?: () => void;
    itemsCallCount?: () => void;
    itemsDisposeCallCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    console.log('DemoLongArray setup');

    let localValue = 10;
    const arr = rst.stateArray<number>([]);

    function add() {
        localValue++;
        arr.push(localValue);
    }

    function remove() {
        arr.pop();
    }

    function changeSecondItem() {
        localValue += 100;
        arr.set(1, localValue);
    }

    function reset() {
        arr.values = [];
    }

    function addTwoItemsAtThird() {
        localValue++;
        arr.add(2, localValue, localValue + 1);
        localValue++;
    }

    function removeTwoItemsAtSecond() {
        arr.remove(1, 2);
    }

    return (props) => {
        props.callCount?.();
        console.log('DemoLongArray render');
        return (
            <div>
                <button onClick={() => arr.forceUpdate()}>forceUpdate arr</button>
                <br />
                <button data-testid="add" onClick={add}>
                    add
                </button>
                <button data-testid="remove" onClick={remove}>
                    remove
                </button>
                <button data-testid="changeSecondItem" onClick={changeSecondItem}>
                    change second item
                </button>
                <button data-testid="reset" onClick={reset}>
                    reset
                </button>
                <br />
                <button onClick={addTwoItemsAtThird}>add Two Items At Third</button>
                <button onClick={removeTwoItemsAtSecond}>remove Two Items At Second</button>
                <br />
                {arr.mapItems((item, idx) => {
                    return (
                        <LongArrayItem
                            key={item.key}
                            item={item}
                            callCount={props.itemsCallCount}
                            disposeCallCount={props.itemsDisposeCallCount}
                        />
                    );
                })}
            </div>
        );
    };
});

const LongArrayItem = rst.create<{
    callCount?: () => void;
    disposeCallCount?: () => void;
    item: rst.StateArrayItem<number>;
}>((ctx) => {
    ctx.props.callCount?.();
    console.log('LongArrayItem setup');
    ctx.onDispose(() => {
        ctx.props.disposeCallCount?.();
        console.log('LongArrayItem teardown');
    });
    return (props) => {
        ctx.props.callCount?.();
        console.log('LongArrayItem render');
        return <button onClick={() => props.item.forceUpdate()}>item:{props.item.value}</button>;
    };
});
