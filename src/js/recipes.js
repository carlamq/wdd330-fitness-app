import { loadHeaderFooter } from "./utils.mjs";
import { ApiService } from "./ApiService.mjs";

// Load header and footer
loadHeaderFooter();

class RecipeManager {
    constructor() {
        this.apiService = new ApiService();
        this.searchInput = document.getElementById("recipe-search");
        this.searchBtn = document.getElementById("search-btn");
        this.resultsContainer = document.getElementById("recipe-results");
    }
    
    init() {
        if (!this.searchInput || !this.searchBtn || !this.resultsContainer) {
            console.error("Elements not found in the DOM");
            return;
        }
        this.searchBtn.addEventListener("click", () => {
            this.searchRecipes();
        });
        this.searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.searchRecipes();
            }
        });

        console.log("Recipe Manager initialized!");
    }


    async searchRecipes() {
        //get the text
        const query = this.searchInput.value.trim();
        // Validate
        if (!query) {
            this.showMessage("Please enter a search term");
            return;
        }
        this.showLoading(true);
        try {
            const recipes = await this.apiService.searchRecipes(query, {
                number: 6,  //number of recipes
                diet: "healthy"
            });

            this.displayRecipes(recipes);

        } catch (error) {
            console.error("Error searching recipes:", error);
            this.showMessage("Sorry, couldn't find recipes. Try again!");
        } finally {
            this.showLoading(false);
        }
    }
    showMessage(message) {
        this.resultsContainer.innerHTML = `
            <div class="message">
                <p>${message}</p>
            </div>
        `;
    }

    showLoading(show) {
        if (show) {
            this.resultsContainer.innerHTML = `
                <div class="loading">
                    <p>Loading recipes...</p>
                </div>
            `;
        }
    }

    displayRecipes(recipes) {
        if (!recipes || recipes.length === 0) {
            this.showMessage("No recipes found. Try a different search!");
            return;
        }

        const recipesHTML = recipes.map(recipe => `
            <div class="recipe-card">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <p>Ready in ${recipe.readyInMinutes || "30"} minutes</p>
                <button class="btn-secondary" onclick="window.open('${recipe.sourceUrl}', '_blank')">
                    View Recipe
                </button>
            </div>
        `).join("");//to open the window in other tab

        this.resultsContainer.innerHTML = recipesHTML;
    }
}

const recipeManager = new RecipeManager();
recipeManager.init();