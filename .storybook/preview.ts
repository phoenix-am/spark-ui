import type { Preview } from '@storybook/react';

// Live Wire's typeface.
if (typeof document !== 'undefined' && !document.getElementById('spark-ui-font')) {
  const link = document.createElement('link');
  link.id = 'spark-ui-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap';
  document.head.appendChild(link);
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'carbon',
      values: [
        { name: 'carbon', value: '#0B0D12' },
        { name: 'raised', value: '#141822' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
