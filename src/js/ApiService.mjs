export default class ApiService {
    constructor() {
        this.spoonacularUrl = "https://api.spoonacular.com/recipes";
        this.spoonacularKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
    }

    //search recipes
    async searchRecipes(query, options = {}) {
        try {
            const params = new URLSearchParams({
                apiKey: this.spoonacularKey,
                query: query,
                number: options.number || 12,
                addRecipeInformation: true,
                fillIngredients: true,
                ...options//is better like this for expandthe posible options in the search and allow more words to search
            });
            const response = await fetch(`${this.spoonacularUrl}/complexSearch?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error("Error searching recipes:", error);
            throw error;
        }
    }

    //Get recipe details
    async getRecipeDetails(recipeId) {
        try {
            const response = await fetch(
                `${this.spoonacularUrl}/${recipeId}/information?apiKey=${this.spoonacularKey}&includeNutrition=true`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error getting recipe details:", error);
            throw error;
        }
    }

    //find recipes by ingredients
    async findRecipesByIngredients(ingredients, number = 12) {
        try {
            const params = new URLSearchParams({
                apiKey: this.spoonacularKey,
                ingredients: ingredients.join(','),
                number: number,
                ranking: 1,
                ignorePantry: true
            });
            const response = await fetch(`${this.spoonacularUrl}/findByIngredients?${params}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error finding recipes by ingredients:", error);
            throw error;
        }
    }
}

