// jest.config.js
module.exports = {
    roots: ['<rootDir>/src/__tests__'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '^.+\\.test\\.(ts|tsx)$',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
