import react from "@vitejs/plugin-react";
import { defineConfig, transformWithEsbuild } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "load-js-files-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic"
        });
      }
    },
    react()
  ],
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"]
        }
      }
    }
  }
});
