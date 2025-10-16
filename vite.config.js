import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  base: "/", //Netlify
  publicDir: "../public", // public

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        profile: resolve(__dirname, "src/pages/profile.html"),
        recipes: resolve(__dirname, "src/pages/recipes.html"),
        workouts: resolve(__dirname, "src/pages/workouts.html"),
        favorites: resolve(__dirname, "src/pages/favorites.html"),
        featured: resolve(__dirname, "src/pages/featured.html"),
      },
    },
  },
});