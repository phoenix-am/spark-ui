# Spark UI

**Spark UI** is a highly customizable, enterprise-grade React component library designed to adhere to best practices in terms of architecture, theming, accessibility, and performance. This library is inspired by Material UI but is fully custom-built without relying on the Material UI framework itself.

## Quick start

```bash
npm install @spark-ui/core
```

```tsx
// app/layout.tsx (Next.js) or your entry file: import the styles once.
import '@spark-ui/core/styles.css';

// Anywhere, including React Server Components:
import { Button, Switch, Textfield } from '@spark-ui/core';
// or per component, to load only what you use:
import { DatePicker } from '@spark-ui/core/date-picker';
```

No provider and no CSS-in-JS runtime is needed. Components are plain React + one stylesheet, and every file is marked `"use client"`, so they drop straight into Next.js App Router pages.

## Live Wire theme

Spark UI's default theme is **Live Wire**: components carry current.

- **Button** throws sparks from the press point; outlined and text buttons show current flowing on hover (`spark={false}` turns it off).
- **Switch** is a lever that closes a circuit and lights a bulb.
- **Textfield** charges up as its value becomes valid (`charge`, 0 to 1 or a function of the value).
- **Tabs, Accordion, Progress** show current flowing through the active part; **Modal** arrives like a power cut.

All motion respects `prefers-reduced-motion`.

## Theming

**Light, dark or system mode:** set an attribute on any element, usually `<html>`.

```html
<html data-spark-theme="light">   <!-- "dark" (default), "light" or "system" -->
```

**Change tokens with plain CSS:** every token is a CSS variable.

```css
:root {
  --spark-energy-current: #3af2ff;   /* the colour of the current */
  --spark-brand-fill: #3af2ff;
  --spark-brand-ink: #3af2ff;        /* the same colour as text and lines */
  --spark-radius-medium: 12px;
  --spark-font: 'Inter', sans-serif;
}
```

**Or in TypeScript**, changing only what you need:

```tsx
import { ThemeProvider } from '@spark-ui/system';

<ThemeProvider mode="system" theme={{ energy: { current: '#3AF2FF', ink: '#3AF2FF' } }}>
  <App />
</ThemeProvider>
```

`createTheme(partial, mode)` and `themeToCss(theme)` from `@spark-ui/styles` turn the same overrides into a stylesheet.

**Restyle any part:** components expose stable class names and state attributes, for example `.sp-switch[data-state="on"] .sp-switch__bulb` or `.sp-button[data-variant="outlined"]`. Each component's doc comment lists its style hooks.

## App-wide defaults and slots

Set defaults once for the whole app, the way MUI's `theme.components` works. Props set on an instance always win.

```tsx
import { SparkProvider } from '@spark-ui/core';

<SparkProvider
  components={{
    Button: { defaultProps: { variant: 'outlined' }, classNames: { root: 'rounded-full' } },
    Switch: { classNames: { bulb: 'my-bulb' } },
  }}
>
  <App />
</SparkProvider>
```

Style one part of one instance with `classNames`, for example `<Switch classNames={{ bulb: 'my-bulb' }} />`. Button, Switch, Checkbox, Textfield, Slider, Select, Modal, DatePicker, Badge and Field accept it.

## Forms

- Every input submits with a plain `<form>`: Select and DatePicker include hidden inputs, Switch submits `value` while on.
- Works with React Hook Form: `register` for Textfield and Checkbox, `Controller` for Select and DatePicker (see Storybook, Foundations / Forms).
- `Field` gives any control (a textarea, a rich-text editor) a linked label, help text and error: `<Field label="Notes" error={err}><textarea /></Field>`.

## Accessibility

Select, Modal, Tooltip, Tabs, DatePicker, Calendar and Slider are built on React Aria hooks: typeahead, focus containment and restoration, screen-reader announcements and dismissal behave the way they do in Adobe's products. Every Storybook story is checked with axe in CI (`npm test`), alongside keyboard behaviour tests and server-rendering tests.

## Base components

Spark UI is built in two layers, like MUI:

- **Base components** (`@spark-ui/core/base`): `ButtonBase`, `InputBase`, `Popover`, `ListBox` (with `ListItemContent`) and `Overlay`. Generic building blocks that already carry the Live Wire look.
- **Components** built from them: Button on ButtonBase; Textfield and Combobox on InputBase; Dropdown, Combobox, Menu and DatePicker on Popover (+ ListBox); Modal on Overlay.

Use the base layer to build components we don't ship, and they will match the rest. See *Foundations → Base components* in Storybook. The base layer is unstable until 1.0.

### Dropdown, Combobox and Menu

| | Use it to | Built on |
|---|---|---|
| `Dropdown` (alias `Select`) | pick one value from a list | Popover + ListBox |
| `Combobox` | type to search, then pick (or enter free text) | InputBase + Popover + ListBox |
| `Menu` | run an action (Edit, Delete), with submenus | Popover + shared list items |

Options can be grouped: `options={[{ label: 'Asia', options: [...] }]}`. Dropdown's value type follows its options, so numbers come back as numbers.

## Languages, dates and right-to-left

Set the locale once and every date, weekday name, digit and arrow key follows it:

```tsx
<SparkProvider locale="hi-IN">   {/* or ar-EG for right-to-left, en-US, ja-JP... */}
  <App />
</SparkProvider>
```

- **DatePicker** takes typed dates, one segment per part, in the locale's order (DD/MM/YYYY for `en-IN`, MM/DD/YYYY for `en-US`). Up and Down change a segment. `onChange` gives a plain JS `Date`, and `name` adds a hidden ISO `YYYY-MM-DD` input for forms.
- **Other calendars:** `<DatePicker calendar="indian" />` shows the Saka calendar; `islamic-umalqura`, `buddhist`, `persian`, `japanese` and more also work. Values stay Gregorian JS Dates.
- **Tabs** support `orientation="vertical"` and `activation="manual"`, and mirror arrow keys in right-to-left locales.
- **Slider** takes a `[start, end]` value for a range with two knobs. `onChangeEnd` fires once on release (for saving or fetching), and `formatOptions` formats numbers in the locale, e.g. `{ style: 'currency', currency: 'INR' }`.
- Tabs, DatePicker, Slider and the rest work when rendered from a React Server Component.

`DatePicker`'s `format` and `placeholder` props are deprecated (the segments replace them), as is `weekStartsOn` (use `firstDayOfWeek: 'sun' | 'mon' | ...`). They are still accepted and will be removed in 1.0. The old Dropdown props (`prependIcon`, `forTeams`, `containerStyle`...) also still work but are deprecated; Dropdown's `value` is now controlled (use `defaultValue` for a starting value), and its CSS classes are `sp-dropdown__*` (Select's were `sp-select__*`). Slider's `onChange` now receives only the value (no event), which is what React Hook Form's `register` expects too.

## Packages

| Package | What it holds |
| --- | --- |
| `@spark-ui/core` | The components, `SparkProvider` and `styles.css` |
| `@spark-ui/styles` | Theme tokens, `createTheme`, `themeToCss` |
| `@spark-ui/system` | Optional `ThemeProvider` and `useTheme` |
| `@spark-ui/icons` | About 860 SVG icons as React components |
| `@spark-ui/utils` | Small helpers |

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
