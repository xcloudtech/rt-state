import { configure } from '@storybook/react';

function loadStories() {
    require('./index.tsx');
}

configure(loadStories, module);
