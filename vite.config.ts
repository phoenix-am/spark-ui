import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '${resolve(__dirname, "./src/styles/global.scss")}';
        `,
      },
    }
  }
});