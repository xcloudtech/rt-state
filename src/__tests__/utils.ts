import { waitFor } from '@testing-library/react';

export async function delay(ms: number = 100) {
    await waitFor(
        () => {
            expect(0).toBe(1);
        },
        {
            timeout: ms,
            onTimeout: () => null,
        },
    );
}
