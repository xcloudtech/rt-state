import * as React from 'react';
import { rst } from '../';

export const DemoNormalArray = rst.create<{
    callCount?: () => void;
    itemsCallCount?: () => void;
    itemsDisposeCallCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    let localValue = 100;
    const arr = rst.stateS([]);
    function add() {
        localValue++;
        arr.value.push(localValue);
        arr.forceUpdate();
    }

    function remove() {
        arr.value.pop();
        arr.forceUpdate();
    }

    function changeSecondItem() {
        localValue += 100;
        arr.value[1] = localValue;
        arr.forceUpdate();
    }

    function reset() {
        arr.value = [];
    }

    return (props) => {
        props.callCount?.();
        return (
            <div>
                <button data-testid="add" onClick={add}>
                    add
                </button>
                <button data-testid="remove" onClick={remove}>
                    remove
                </button>
                <button data-testid="changeSecondItem" onClick={changeSecondItem}>
                    changeSecondItem
                </button>
                <button data-testid="reset" onClick={reset}>
                    reset
                </button>
                <br />
                {arr.value.map((v, idx) => (
                    <NormalArrayItem
                        callCount={props.itemsCallCount}
                        disposeCallCount={props.itemsDisposeCallCount}
                        key={idx}
                        item={v}
                    />
                ))}
            </div>
        );
    };
});

const NormalArrayItem = rst.create<{ callCount?: () => void; disposeCallCount?: () => void; item: number }>((ctx) => {
    ctx.props.callCount?.();
    ctx.onDispose(() => {
        ctx.props.disposeCallCount?.();
    });
    return (props) => {
        ctx.props.callCount?.();
        return <button>{props.item}</button>;
    };
});
