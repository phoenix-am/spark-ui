import { defineConfig } from 'tsup';

// One entry per component so apps can import only what they use, e.g.
// import { Button } from '@sparkwire/core/button'. Every file is marked
// "use client" so components drop straight into Next.js App Router pages.
export default defineConfig({
  entry: {
    'base/index': 'src/base/index.ts',
    'headless/index': 'src/headless/index.tsx',
    'select/index': 'src/Select/index.ts',
    'combobox/index': 'src/Combobox/index.ts',
    'menu/index': 'src/Menu/index.ts',
    'field/index': 'src/Field/index.ts',
    'provider/index': 'src/Provider/index.ts',
    "index": "src/index.ts",
    "accordion/index": "src/Accordion/index.ts",
    "avatar/index": "src/Avatar/index.ts",
    "button/index": "src/Button/index.ts",
    "card/index": "src/Card/index.ts",
    "checkbox/index": "src/Checkbox/index.ts",
    "date-picker/index": "src/DatePicker/index.ts",
    "dropdown/index": "src/Dropdown/index.ts",
    "indicators/index": "src/Indicators/index.ts",
    "input-base/index": "src/InputBase/index.ts",
    "modal/index": "src/Modal/index.ts",
    "radio-group/index": "src/RadioGroup/index.ts",
    "slider/index": "src/Slider/index.ts",
    "spark/index": "src/Spark/index.ts",
    "switch/index": "src/Switch/index.ts",
    "tabs/index": "src/Tabs/index.ts",
    "textfield/index": "src/Textfield/index.ts",
    "toast/index": "src/Toast/index.ts",
    "tooltip/index": "src/Tooltip/index.ts"
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: true,
  target: 'es2019',
  banner: { js: '"use client";' },
  external: ['react', 'react-dom', /^@sparkwire\//],
});
