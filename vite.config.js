import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        profile: resolve(__dirname, "src/pages/profile/index.html"),
        recipes: resolve(__dirname, "src/pages/recipes/index.html"),
        workouts: resolve(__dirname, "src/pages/workouts/index.html"),
        mealplan: resolve(__dirname, "src/pages/meal-plan/index.html"),
        favorites: resolve(__dirname, "src/pages/favorites/index.html"),
      },
    },
  },
});