import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Spark UI · Live Wire',
    colorPrimary: '#FFD60A',
    colorSecondary: '#FFD60A',
    appBg: '#0B0D12',
    appContentBg: '#0B0D12',
    appBorderColor: '#262C3A',
    barBg: '#141822',
    barSelectedColor: '#FFD60A',
    textColor: '#F2F4F8',
    textMutedColor: '#A9B0BF',
    fontBase: "'Sora', system-ui, sans-serif",
  }),
});
