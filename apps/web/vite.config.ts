import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 3001,
    host: "127.0.0.1",
    proxy: {
      "/extra": "http://127.0.0.1:3000",
    },
  },
  build: {
    outDir: "../../dist",
  },
});
