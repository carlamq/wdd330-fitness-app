import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import ApiService from "./ApiService.mjs";

loadHeaderFooter();


export default class RecipeManager {
    constructor(searchSelector, buttonSelector, resultsSelector) {
        this.searchSelector = searchSelector;
        this.buttonSelector = buttonSelector;
        this.resultsSelector = resultsSelector;
        this.apiService = new ApiService();
        this.searchInput = null;
        this.searchBtn = null;
        this.resultsContainer = null;
    }
    
    init() {
        loadHeaderFooter();
        this.setupElements();
        this.setupEventListeners();
    }
    setupElements() {
        this.searchInput = document.querySelector(this.searchSelector);
        this.searchBtn = document.querySelector(this.buttonSelector);
        this.resultsContainer = document.querySelector(this.resultsSelector);

        if (!this.searchInput || !this.searchBtn || !this.resultsContainer) {
            console.error("Recipe elements not found in the DOM");
            return false;
        }
        return true;
    }

    setupEventListeners() {
        this.searchBtn.addEventListener("click", () => {
            this.handleSearch();
        });
        this.searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.handleSearch();
            }
        });
    }

    async handleSearch() {
        const query = this.searchInput.value.trim();
        if (!query) {
            alertMessage("Please enter a search term");
            return;
        }
        try {
            const searchOptions = {
                number: 6,
                diet: "healthy"
            };
            
            const recipes = await this.apiService.searchRecipes(query, searchOptions);
            this.displayResults(recipes);

        } catch (error) {
            console.error("Error searching recipes:", error);
        }
    }

    displayResults(recipes) {
        if (!recipes || recipes.length === 0) {
            alertMessage("No recipes found. Try a different search!");
            return;
        }

        const recipesHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join("");
        this.resultsContainer.innerHTML = recipesHTML;
    }

    createRecipeCard(recipe) {
        const { title, image, readyInMinutes, sourceUrl } = recipe;
        const cookTime = readyInMinutes || "30";
        
        return `
            <div class="recipe-card">
                <img src="${image}" alt="${title}" loading="lazy">
                <h3>${title}</h3>
                <p>Ready in ${cookTime} minutes</p>
                <button class="btn-secondary" onclick="window.open('${sourceUrl}', '_blank')">
                    View Recipe
                </button>
            </div>
        `;
    }
}

const recipeManager = new RecipeManager("#recipe-search", "#search-btn", "#recipe-results");
recipeManager.init();