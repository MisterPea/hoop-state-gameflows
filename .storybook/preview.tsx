import type { Preview } from "@storybook/nextjs-vite";

import "../src/styles/globals.scss";

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    options: {
      storySort: {
        order: [
          'Per Page Components', ['Header', 'Footer'],
          'Per Season Components', ['Season Nav Button', 'Season Nav Button Row', 'Game Card', 'Game Card Date Wrapper'],
          'Per Game Components', ['Game Title', 'Game Info', 'Section Wrapper', 'Attempts Made Bar', 'Attempts Made Bar Group', 'Lineup Bar', 'Game Flow Row', 'Score Margin Chart', 'Box Score', 'Shot Chart']
        ]
      }
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
