import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { delay } from './utils';
import { DemoUseRState, DemoUseRStateCreateSWrapper, DemoUseRStateS } from '../demo/demo-view';

test('view: DemoUseRState', async () => {
    // render
    const { getByTestId } = render(<DemoUseRState />);
    expect(getByTestId('non-reactive')).toHaveTextContent('100');
    expect(getByTestId('reactive')).toHaveTextContent('100');
    const addButton = getByTestId('add');
    // act
    fireEvent.click(addButton);
    // assert
    await waitFor(() => {
        expect(getByTestId('non-reactive')).toHaveTextContent('100');
        expect(getByTestId('reactive')).toHaveTextContent('101');
    });
});

test('view: DemoUseRStateCreateSWrapper', async () => {
    const { getByTestId } = render(<DemoUseRStateCreateSWrapper />);
    expect(getByTestId('non-reactive')).toHaveTextContent('100');
    expect(getByTestId('reactive')).toHaveTextContent('100');
    const addButton = getByTestId('add');
    fireEvent.click(addButton);
    await waitFor(() => {
        // non-reactive becomes reactive because the whole component's wrapped by rst.createS.
        expect(getByTestId('non-reactive')).toHaveTextContent('101');
        expect(getByTestId('reactive')).toHaveTextContent('101');
    });
});

test('view: DemoUseRStateS', async () => {
    const { getByTestId } = render(<DemoUseRStateS />);
    expect(getByTestId('reactive')).toHaveTextContent('10');
    const addAndForceUpdateButton = getByTestId('addAndForceUpdate');
    const justAddButton = getByTestId('justAdd');
    /////////////////////////
    fireEvent.click(addAndForceUpdateButton);
    await waitFor(() => {
        expect(getByTestId('reactive')).toHaveTextContent('20');
    });
    /////////////////////////
    fireEvent.click(justAddButton);
    await delay();
    expect(getByTestId('reactive')).toHaveTextContent('20');
    fireEvent.click(addAndForceUpdateButton);
    await waitFor(() => {
        expect(getByTestId('reactive')).toHaveTextContent('40');
    });
});
