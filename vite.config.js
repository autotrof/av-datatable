import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "av-datatable",
      fileName: format => `av-datatable.${format}.min.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    },
	minify: 'esbuild'
  },
  plugins: [vue()],
})
