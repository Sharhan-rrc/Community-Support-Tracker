module.exports = {
    testEnvironment: 'jsdom',
    verbose: true,
    collectCoverage: false,
    coverageDirectory: 'coverage',
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    collectCoverageFrom: [
        'js/**/*.js',
        '!js/**/*.test.js',
        '!**/node_modules/**'
    ],
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: 'test-results/jest',
            outputName: 'results.xml'
        }]
    ]
};
