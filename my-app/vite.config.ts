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
        login: resolve(__dirname, "src/login.html"),
        signup: resolve(__dirname, "src/signup.html"),
        hotel_info: resolve(__dirname, "src/hotel_info.html"),
        admin: resolve(__dirname, "src/admin.html"),
        booking: resolve(__dirname, "src/booking.html"),
        personal_info: resolve(__dirname, "src/personal_info.html"),
      },
    },
  },
});
