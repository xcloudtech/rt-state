// @ts-ignore
import React, { useEffect, useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

function reverseString(str: string) {
    return str.split('').reverse().join('');
}

test('', () => {
    expect(reverseString('hello')).toBe('olleh');
});

//////////////////////////////////////////////////////////////////////////////

const Counter = () => {
    const [count, setCount] = useState(0);

    return (
        <div>
            <div data-testid="count-announcement"> you have been clicked {count} times</div>
            <button
                data-testid="increase-button"
                onClick={() => {
                    setCount(count + 1);
                }}>
                {' '}
                increase count
            </button>
        </div>
    );
};

test('the count should be 1 when you click the increase button once', () => {
    // render
    const { getByTestId } = render(<Counter />);
    const increaseButton = getByTestId('increase-button');
    // act
    fireEvent.click(increaseButton);
    // assert
    expect(getByTestId('count-announcement')).toHaveTextContent('1');
});

//////////////////////////////////////////////////////////////////////////////

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://my-json-server.typicode.com/pengmq/mock-server/profile', {});
                setIsLoading(false);
                setUsername(response.data.data.username);
            } catch (error) {
                setIsLoading(false);
                setErrorMessage(error);
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <div data-testid="error-message">{errorMessage}</div>
            <div data-testid="loading-text">
                <span>{isLoading ? 'loading....' : ''}</span>
            </div>
            <div data-testid="username">{username}</div>
        </div>
    );
};

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('loading text should hide and user name should show after get profile data successfully from server ', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: { username: 'nana' } } });

    const { getByTestId, container } = render(<Profile />);
    // awaiting for sync function to be done with  await waitForElement()
    const [loadingText, username] = await waitFor(() => [getByTestId('loading-text'), getByTestId('username')], {
        container,
    } as any);
    expect(loadingText).toHaveTextContent('');
    expect(username).toHaveTextContent('nana');
});
