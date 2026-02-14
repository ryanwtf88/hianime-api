# Contributing to HiAnime API

Thank you for your interest in contributing to HiAnime API! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.3.1 or higher
- Node.js v18+ (for documentation site)
- Git

### Setup Instructions

1. **Fork and Clone**
   ```bash
   git clone https://github.com/ryanwtf88/hianime-api.git
   cd hianime-api
   ```

2. **Install Dependencies**
   ```bash
   bun install
   cd docs && npm install && cd ..
   ```

3. **Run Development Server**
   ```bash
   bun run dev
   ```

4. **Run Documentation Site**
   ```bash
   cd docs && npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names following this pattern:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

**Examples:**
- `feature/add-genre-filter`
- `fix/episode-title-display`
- `docs/update-api-examples`

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(api): add character details endpoint"
git commit -m "fix(embed): resolve episode title extraction"
git commit -m "docs(readme): update installation instructions"
```

## Code Standards

### ESLint and Prettier

This project uses ESLint and Prettier for code quality and formatting.

**Before committing:**
```bash
# Check for lint errors
npm run lint

# Auto-fix lint and formatting issues
npm run lint:fix
```

**Pre-commit hooks** automatically run linting via Husky and lint-staged.

### Code Style Guidelines

1. **File Organization**
   - Controllers: `src/controllers/`
   - Routes: `src/routes/`
   - Utilities: `src/utils/`
   - Scrapers: `src/scrapers/`

2. **Naming Conventions**
   - Files: `camelCase.js` (e.g., `embedController.js`)
   - Functions: `camelCase` (e.g., `getAnimeDetails`)
   - Constants: `UPPER_SNAKE_CASE` (e.g., `BASE_URL`)

3. **Error Handling**
   - Always use try-catch blocks for async operations
   - Return meaningful error messages
   - Use appropriate HTTP status codes

4. **Comments**
   - Add JSDoc comments for exported functions
   - Explain complex logic with inline comments
   - Keep comments concise and up-to-date

### Example Code Structure

```javascript
/**
 * Fetches anime details by ID
 * @param {string} id - The anime ID
 * @returns {Promise<Object>} Anime details object
 */
export async function getAnimeDetails(id) {
  try {
    const response = await scrapeAnimeDetails(id);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
```

## Testing

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch
```

### Writing Tests

- Place test files next to the code they test with `.test.js` extension
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

**Example:**
```javascript
import { describe, it, expect } from 'bun:test';
import { getAnimeDetails } from './animeController';

describe('getAnimeDetails', () => {
  it('should return anime details for valid ID', async () => {
    const result = await getAnimeDetails('one-piece-100');
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('title');
  });

  it('should handle invalid ID gracefully', async () => {
    const result = await getAnimeDetails('invalid-id');
    expect(result.success).toBe(false);
  });
});
```

## Pull Request Process

### Before Submitting

1. **Update Documentation**
   - Update README.md if adding new features
   - Add/update API documentation in `docs/`
   - Include code examples where applicable

2. **Run Quality Checks**
   ```bash
   npm run lint        # Check for lint errors
   bun test           # Run tests
   cd docs && npm run build  # Verify docs build
   ```

3. **Update CHANGELOG** (if applicable)
   - Add entry under "Unreleased" section
   - Follow existing format

### Submitting a Pull Request

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues (e.g., "Fixes #123")
   - Provide detailed description of changes
   - Include screenshots for UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring

   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests (if applicable)
   - [ ] Documentation updated

   ## Related Issues
   Closes #(issue number)
   ```

### Review Process

- Maintainers will review your PR within 3-5 business days
- Address review comments promptly
- Keep PR scope focused and manageable
- Be open to feedback and suggestions

## Code of Conduct

### Our Standards

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Collaborative**: Work together constructively
- **Be Professional**: Keep discussions focused and productive
- **Be Inclusive**: Welcome contributors of all backgrounds

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Spam or off-topic discussions
- Publishing others' private information

### Reporting

Report unacceptable behavior to the project maintainers. All reports will be handled confidentially.

## Questions?

- **Issues**: [GitHub Issues](https://github.com/ryanwtf88/hianime-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ryanwtf88/hianime-api/discussions)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to HiAnime API! 🎉
