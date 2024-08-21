# Spark UI

**Spark UI** is a highly customizable, enterprise-grade React component library designed to adhere to best practices in terms of architecture, theming, accessibility, and performance. This library is inspired by Material UI but is fully custom-built without relying on the Material UI framework itself.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Branching Strategy](#branching-strategy)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with the Spark UI component library:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/spark-ui.git
   cd spark-ui
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Build the packages:**

   ```bash
   yarn build
   ```

4. **Run Storybook for component development:**

   ```bash
   yarn storybook
   ```

## Folder Structure

The `spark-ui` monorepo is organized as follows:

```
spark-ui/
│
├── packages/
│   ├── core/              # Core components package
│   ├── styles/            # Theme and style management
│   ├── utils/             # Utility functions
│   └── icons/             # Icon components
│
├── docs/                  # Documentation and guides
├── storybook/             # Storybook configuration
├── .github/               # GitHub actions and workflows
└── README.md              # This readme file
```

## Creating Components

When creating a new component:

1. **Create a new folder for the component in `packages/core/src/components/`.**

2. **Create the component file:**

   - **Button.tsx:**

     ```tsx
     import React from 'react';
     import { applySlots } from '@spark-ui/utils/slots';
     import { ButtonProps } from './Button.types';

     export const Button: React.FC<ButtonProps> = ({ startIcon, endIcon, children, ...props }) => {
       const buttonElement = (
         <button {...props}>
           {children}
         </button>
       );

       return applySlots({ slots: { startIcon, endIcon }, component: buttonElement });
     };
     ```

3. **Create the types file:**

   - **Button.types.ts:**

     ```typescript
     import * as React from 'react';
     import { OverrideProps } from '@spark-ui/utils';

     export interface ButtonProps {
       startIcon?: React.ReactNode;
       endIcon?: React.ReactNode;
       children: React.ReactNode;
       component?: React.ElementType;
     }
     ```

4. **Create a styles file (if needed):**

   - **Button.styles.ts:**

     ```typescript
     import { css } from '@emotion/react';

     export const buttonStyles = css`
       padding: 8px 16px;
       border-radius: 4px;
       background-color: #007bff;
       color: white;
       display: inline-flex;
       align-items: center;
       justify-content: center;

       .icon {
         margin: 0 4px;
       }
     `;
     ```

5. **Add the component to the package's `index.ts` for export:**

   - **index.ts:**

     ```typescript
     export * from './Button';
     ```

## Theming

Spark UI allows you to fully customize the theme to fit your brand's needs. The theme is managed in the `@spark-ui/styles` package.

### Example Theme:

```typescript
import { Theme as EmotionTheme } from '@emotion/react';

export interface Theme {
  colors: {
    primary: string;
    // ...other color properties
  };
  // ...other theme properties
}

export const theme: Theme = {
  colors: {
    primary: '#007bff',
    // ...other color values
  },
  // ...other theme values
};

export type EmotionThemeType = EmotionTheme & Theme;
```

### Usage in Components:

In your component, you can access the theme using the `useTheme` hook (if implemented) or via styled components using Emotion.

```typescript
import styled from '@emotion/styled';

export const StyledButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  // ...other styles
`;
```

## Slots and Polymorphic Components

Spark UI supports polymorphic components and slots, inspired by Material UI's approach. This allows you to extend components and manage content placement with great flexibility.

### Polymorphic Component Example:

```tsx
import React from 'react';
import { OverrideProps } from '@spark-ui/utils';

export type ButtonProps<C extends React.ElementType> = OverrideProps<ButtonTypeMap, C>;

interface ButtonTypeMap {
  props: {
    children: React.ReactNode;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  };
  defaultComponent: 'button';
}

export const Button = <C extends React.ElementType = 'button'>({
  component: Component = 'button',
  startIcon,
  endIcon,
  children,
  ...props
}: ButtonProps<C>) => {
  return (
    <Component {...props}>
      {startIcon}
      {children}
      {endIcon}
    </Component>
  );
};
```

### Slot Management:

Slots are managed using the `applySlots` utility function, which ensures the correct placement of slot content within components.

```tsx
import React from 'react';
import { applySlots } from '@spark-ui/utils/slots';

export const Button: React.FC<ButtonProps> = ({ startIcon, endIcon, children }) => {
  const buttonElement = <button>{children}</button>;

  return applySlots({ slots: { startIcon, endIcon }, component: buttonElement });
};
```

## Usage

To use a component from the Spark UI library in your application:

1. **Install the library:**

   ```bash
   yarn add @spark-ui/core @spark-ui/styles @emotion/react
   ```

2. **Import and use a component:**

   ```tsx
   import React from 'react';
   import { Button } from '@spark-ui/core';

   function App() {
     return (
       <Button startIcon={<SomeIcon />} endIcon={<AnotherIcon />}>
         Click Me
       </Button>
     );
   }

   export default App;
   ```

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Write your code and include tests where applicable.
4. Run tests and ensure everything works correctly.
5. Submit a pull request with a detailed description of your changes.

### Development Guidelines

- **Coding Standards**: Follow the existing code style and conventions.
- **Documentation**: Ensure that any new components or utilities are well-documented.
- **Testing**: Write unit tests for new features or changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **Explanation**

- **Getting Started**: Provides prerequisites, installation steps, and basic usage of the library.
- **Branching Strategy**: Explains how to create and manage branches.
- **Commit Message Guidelines**: Provides a structured format for commit messages to ensure clarity and consistency.
- **Available Scripts**: Lists npm scripts that can be used to build, test, lint, and run Storybook.
- **Contributing**: Encourages others to contribute and links to a `CONTRIBUTING.md` file (which you can create to provide more details on contributing).
