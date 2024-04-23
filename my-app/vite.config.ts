import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./src",
  build: {
    outDir: "../dist",
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        hotel: resolve(__dirname, "src/hotel.html"),
        account: resolve(__dirname, "src/account.html"),
        hotel_info: resolve(__dirname, "src/hotel_info.html"),
        admin: resolve(__dirname, "src/admin.html"),
      },
    },
  },
});
