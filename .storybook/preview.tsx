import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { defaultTheme } from '@spark-ui/styles';
import { create } from '@storybook/theming/create';

// Live Wire's typeface.
if (typeof document !== 'undefined' && !document.getElementById('spark-ui-font')) {
  const link = document.createElement('link');
  link.id = 'spark-ui-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap';
  document.head.appendChild(link);
}

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div
          style={{
            fontFamily: defaultTheme.typography.fontFamily,
            color: defaultTheme.text.primary,
            padding: 24,
          }}
        >
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'carbon',
      values: [
        { name: 'carbon', value: '#0B0D12' },
        { name: 'raised', value: '#141822' },
      ],
    },
    docs: {
      theme: create({
        base: 'dark',
        appBg: '#0B0D12',
        appContentBg: '#0B0D12',
        appPreviewBg: '#0B0D12',
        barBg: '#141822',
        colorPrimary: '#FFD60A',
        colorSecondary: '#FFD60A',
        textColor: '#F2F4F8',
        fontBase: "'Sora', system-ui, sans-serif",
      }),
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Actions', 'Inputs', 'Navigation', 'Overlays', 'Data display', 'Feedback', 'Effects'],
      },
    },
  },
};

export default preview;
