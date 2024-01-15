import { fireEvent, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import { DemoLink } from '../demo/demo-link';

test('link: DemoLink', async () => {
    const { getByTestId } = render(<DemoLink />);
    expect(getByTestId('state')).toHaveTextContent('state:(10) callCount:(1)');
    expect(getByTestId('linkedState')).toHaveTextContent('linkedState:(20) callCount:(1)');
    expect(getByTestId('linkedPlusState')).toHaveTextContent('linkedPlusState:(40) callCount:(1)');
    const addStateButton = getByTestId('addState');
    const addLinkedPlusStateButton = getByTestId('addLinkedPlusState');

    fireEvent.click(addStateButton);

    await waitFor(() => {
        expect(getByTestId('state')).toHaveTextContent('state:(11) callCount:(1)');
        expect(getByTestId('linkedState')).toHaveTextContent('linkedState:(22) callCount:(1)');
        expect(getByTestId('linkedPlusState')).toHaveTextContent('linkedPlusState:(44) callCount:(1)');
    });

    fireEvent.click(addLinkedPlusStateButton);

    await waitFor(() => {
        expect(getByTestId('state')).toHaveTextContent('state:(1011) callCount:(1)');
        expect(getByTestId('linkedState')).toHaveTextContent('linkedState:(2022) callCount:(1)');
        expect(getByTestId('linkedPlusState')).toHaveTextContent('linkedPlusState:(4044) callCount:(1)');
    });
});
