import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { DemoCreateS, DemoBatchReRender, DemoDefaultProps } from '../demo/demo-create';

test('create: DemoCreateS', async () => {
    const { getByTestId } = render(<DemoCreateS />);
    expect(getByTestId('count')).toHaveTextContent('count:(10)');
    const addButton = getByTestId('add');

    fireEvent.click(addButton);
    await waitFor(() => {
        expect(getByTestId('count')).toHaveTextContent('count:(11)');
    });
});

test('create: DemoDefaultProps', async () => {
    // render
    const { getByTestId, rerender } = render(<DemoDefaultProps x={10} />);
    expect(getByTestId('xy')).toHaveTextContent('x:10 y:1003');
    expect(getByTestId('obj')).toHaveTextContent('(ox:1 oy:2)');

    rerender(<DemoDefaultProps x={1000} y={10} />);
    expect(getByTestId('xy')).toHaveTextContent('x:1000 y:10');
    expect(getByTestId('obj')).toHaveTextContent('(ox:1 oy:2)');

    rerender(<DemoDefaultProps x={200} obj={{ ox: 3 }} />);
    expect(getByTestId('xy')).toHaveTextContent('x:200 y:1003');
    expect(getByTestId('obj')).toHaveTextContent('(ox:3 oy:)');
});

test('create: DemoBatchReRender', async () => {
    // render
    const callCount = jest.fn();
    const { getByTestId, rerender } = render(<DemoBatchReRender callCount={callCount} />);
    expect(callCount).toBeCalledTimes(2);
    expect(getByTestId('value')).toHaveTextContent('value:(100)');
    const addButton = getByTestId('add');

    callCount.mockClear();
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(getByTestId('value')).toHaveTextContent('value:(100100)');
    });
    // only re-render once.
    expect(callCount).toBeCalledTimes(1);

    callCount.mockClear();
    rerender(<DemoBatchReRender callCount={callCount} />);
    // will not re-render
    expect(callCount).toBeCalledTimes(0);

    callCount.mockClear();
    rerender(<DemoBatchReRender x={'x'} callCount={callCount} />);
    // will re-render once, not re-create
    expect(callCount).toBeCalledTimes(1);
});
