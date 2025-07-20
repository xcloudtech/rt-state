# Contributing to rt-state

Thank you for your interest in contributing to rt-state! We welcome contributions from the community and are pleased to have you join us.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm, yarn, or pnpm
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/xcloudtech/rt-state.git
   cd rt-state
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/xcloudtech/rt-state.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Run tests to ensure everything is working:
   ```bash
   npm test
   ```

3. Start the Storybook development server:
   ```bash
   npm run storybook
   ```

### Available Scripts

- `npm run build` - Build the library for production
- `npm run test` - Run the test suite
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

## Contributing Process

### 1. Create an Issue

Before starting work on a feature or bug fix, please create an issue to discuss:

- **Bug reports**: Include reproduction steps, expected behavior, and actual behavior
- **Feature requests**: Describe the feature, its use case, and potential implementation
- **Documentation**: Describe what documentation needs to be improved or added

### 2. Create a Branch

Create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### Branch Naming Convention

- `feature/feature-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions or improvements

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Your Changes

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
git commit -m "feat: add new state management feature"
git commit -m "fix: resolve memory leak in component cleanup"
git commit -m "docs: update API documentation"
```

#### Commit Types

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks

## Pull Request Guidelines

### Before Submitting

1. Ensure all tests pass: `npm test`
2. Ensure code follows style guidelines: `npm run lint`
3. Update documentation if needed
4. Add or update tests for new features
5. Rebase your branch on the latest upstream main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Pull Request Template

When creating a pull request, please include:

- **Description**: Clear description of what changes were made
- **Motivation**: Why this change is needed
- **Testing**: How the changes were tested
- **Breaking Changes**: Any breaking changes (with migration guide)
- **Checklist**: Complete the provided checklist

### Review Process

1. All PRs require at least one review from a maintainer
2. All checks must pass (tests, linting, etc.)
3. PRs should be up to date with the main branch
4. Address all review comments before merging

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types unless absolutely necessary
- Export types and interfaces that might be useful to consumers

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### Code Organization

- Keep functions small and focused
- Use descriptive variable and function names
- Add comments for complex logic
- Follow the existing project structure

### Performance Considerations

- Consider the impact on bundle size
- Optimize for common use cases
- Profile performance-critical code
- Document any performance trade-offs

## Testing

### Test Requirements

- All new features must include tests
- Bug fixes should include regression tests
- Maintain or improve test coverage

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Organization

- Unit tests: `src/__tests__/`
- Integration tests: Include in relevant test files
- Test utilities: `src/__tests__/utils.ts`

### Testing Guidelines

- Write clear, descriptive test names
- Test both success and error cases
- Mock external dependencies
- Use meaningful assertions

## Documentation

### Types of Documentation

1. **Code Documentation**: JSDoc comments for public APIs
2. **README**: Keep the main README up to date
3. **Examples**: Add examples for new features
4. **Storybook**: Create stories for new components

### Documentation Standards

- Use clear, concise language
- Include code examples
- Explain the "why" not just the "how"
- Keep examples up to date

### Updating Documentation

When adding features:

1. Update the main README if needed
2. Add JSDoc comments to public APIs
3. Create or update Storybook stories
4. Add examples to demonstrate usage

## Issue Guidelines

### Before Creating an Issue

1. Search existing issues to avoid duplicates
2. Check the documentation and examples
3. Try to reproduce the issue with a minimal example

### Bug Reports

Include:

- **Environment**: Node.js version, OS, browser (if applicable)
- **Steps to reproduce**: Minimal reproduction steps
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Code sample**: Minimal code that reproduces the issue

### Feature Requests

Include:

- **Problem**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives**: What alternatives have you considered?
- **Use case**: Describe your specific use case

### Questions

For questions about usage:

1. Check the documentation first
2. Look at existing examples
3. Search existing issues and discussions
4. Create a discussion rather than an issue

## Release Process

Releases are handled by maintainers:

1. Version bumping follows [semantic versioning](https://semver.org/)
2. Changelog is automatically generated from commit messages
3. npm packages are published automatically via CI/CD

### Semantic Versioning

- **MAJOR** version: Breaking changes
- **MINOR** version: New features (backwards compatible)
- **PATCH** version: Bug fixes (backwards compatible)

## Recognition

Contributors will be recognized in:

- The project's README
- Release notes for significant contributions
- The contributors page (when available)

## Getting Help

If you need help:

1. Check the documentation
2. Look at existing examples
3. Search existing issues
4. Create a discussion for questions
5. Join our community (links in README)

## License

By contributing to rt-state, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to rt-state! 🎉
