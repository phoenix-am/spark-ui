import React from 'react';
import type { Preview } from '@storybook/react';
import { create } from '@storybook/theming/create';
import { ThemeProvider } from '@sparkwire/system';
import '../packages/core/src/styles/index.css';

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
  globalTypes: {
    mode: {
      description: 'Live Wire colour mode',
      toolbar: {
        title: 'Mode',
        icon: 'contrast',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { mode: 'dark' },
  decorators: [
    (Story, context) => (
      <ThemeProvider mode={context.globals.mode ?? 'dark'}>
        <div
          style={{
            background: 'var(--spark-surface-base)',
            color: 'var(--spark-text-primary)',
            fontFamily: 'var(--spark-font)',
            padding: 24,
            minHeight: context.viewMode === 'docs' ? undefined : '100vh',
            boxSizing: 'border-box',
          }}
        >
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
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
