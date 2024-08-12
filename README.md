# Spark UI Component library

A reusable React component library built with React, TypeScript and Storybook. This library is designed to provide customizable and accessible UI components with material-inspired animations.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Storybook](#storybook)
- [Testing](#testing)
- [Branching Strategy](#branching-strategy)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (=20.x)
- npm (>=8.x)
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/phoenix-am/spark-ui.git
cd spark-ui
```

Install dependencies:

```bash
npm install
```

### Usage

To use the components in your project, you can import them directly after building the library:

```typescript
import { Button, Input, Modal } from 'spark-ui';

const MyApp = () => (
  <div>
    <Button label="Click Me" onClick={() => alert('Clicked!')} />
    <Input type="text" placeholder="Type something..." />
    <Modal title="Sample Modal" isOpen={true}>
      <p>This is a modal content</p>
    </Modal>
  </div>
);
```

## Branching Strategy

To maintain a clean and organized Git history, follow the below branching strategy:

- **`main`**: The main branch should always contain the latest stable version of the project. Merges into this branch should be done through pull requests and only after passing all tests.

- **`develop`**: The development branch where features are merged before being promoted to `main`. The `develop` branch should always be stable.

- **Feature Branches**: Create a new branch for each feature or bug fix:
  - Name: `feature/feature-name` or `bugfix/bug-description`
  - Example: `feature/add-button-component` or `bugfix/fix-modal-styling`
  - Always branch off from `develop`.

- **Release Branches**: Create a release branch when you're preparing for a new release:
  - Name: `release/vX.X.X`
  - Example: `release/v1.0.0`
  - Merge into both `main` and `develop` after the release.

- **Hotfix Branches**: For critical fixes in the production code:
  - Name: `hotfix/description`
  - Example: `hotfix/fix-critical-bug`
  - Merge into both `main` and `develop`.

## Commit Message Guidelines

Use the following format for commit messages:

```
<type>(<scope>): <subject>
```

### **Types**

- **`feat`**: A new feature
- **`fix`**: A bug fix
- **`docs`**: Documentation changes
- **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **`refactor`**: A code change that neither fixes a bug nor adds a feature
- **`perf`**: A code change that improves performance
- **`test`**: Adding missing tests or correcting existing tests
- **`chore`**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### **Examples**

```bash
feat(button): add ripple effect to button component
fix(modal): resolve issue with modal closing animation
docs(readme): update installation instructions
style(button): format button styles
```

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **Explanation**

- **Getting Started**: Provides prerequisites, installation steps, and basic usage of the library.
- **Branching Strategy**: Explains how to create and manage branches.
- **Commit Message Guidelines**: Provides a structured format for commit messages to ensure clarity and consistency.
- **Available Scripts**: Lists npm scripts that can be used to build, test, lint, and run Storybook.
- **Contributing**: Encourages others to contribute and links to a `CONTRIBUTING.md` file (which you can create to provide more details on contributing).