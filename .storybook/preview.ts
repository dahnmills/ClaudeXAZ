import type { Preview } from '@storybook/angular';
// Les styles globaux sont chargés par le builder Angular via angular.json (styles: ["src/styles/styles.scss"])

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Design System', 'Local Components', 'Pages'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',   value: '#ffffff' },
        { name: 'grey',    value: '#f5f5f5' },
        { name: 'dark',    value: '#003781' },
        { name: 'black',   value: '#121212' },
      ],
    },
  },
};

export default preview;
