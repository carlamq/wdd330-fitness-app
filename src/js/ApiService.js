class ApiService {
    constructor() {
        // URL for API
        this.rapidApiUrl = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com';
        this.spoonacularUrl = 'https://api.spoonacular.com/recipes';
        
        // Headers for RapidAPI-AI Workout Planner
        this.rapidApiHeaders = {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
            'Content-Type': 'application/json'
        };
        
        // API Key Spoonacular
        this.spoonacularKey = import.meta.env.VITE_SPOONACULAR_KEY;
    }

    //====== AI WORKOUT PLANNER METHODS =========
    
    //generates personal plans
    async generateWorkoutPlan(userData) {
        try {
            const response = await fetch(`${this.rapidApiUrl}/generateWorkoutPlan`, {
                method: 'POST',
                headers: this.rapidApiHeaders,
                body: JSON.stringify({
                    goal: userData.goal,
                    fitness_level: userData.fitness_level,
                    preferences: userData.preferences,
                    health_conditions: userData.health_conditions || ["None"],
                    schedule: {
                        days_per_week: userData.days_per_week,
                        session_duration: userData.session_duration
                    },
                    plan_duration_weeks: userData.plan_duration_weeks,
                    lang: "en"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error generating workout plan:', error);
            throw error;
        }
    }

    //detils of exercises
    async getExerciseDetails(exerciseName) {
        try {
            const response = await fetch(`${this.rapidApiUrl}/exerciseDetails`, {
                method: 'POST',
                headers: this.rapidApiHeaders,
                body: JSON.stringify({
                    exercise_name: exerciseName,
                    lang: "en"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error getting exercise details:', error);
            throw error;
        }
    }

    //nutrition advaice
    async getNutritionAdvice(nutritionData) {
        try {
            const response = await fetch(`${this.rapidApiUrl}/nutritionAdvice`, {
                method: 'POST',
                headers: this.rapidApiHeaders,
                body: JSON.stringify({
                    goal: nutritionData.goal,
                    dietary_restrictions: nutritionData.dietary_restrictions || [],
                    current_weight: nutritionData.current_weight,
                    target_weight: nutritionData.target_weight,
                    daily_activity_level: nutritionData.daily_activity_level,
                    lang: "en"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error getting nutrition advice:', error);
            throw error;
        }
    }

    //generate plan base on goals
    async generateGoalWorkoutPlan(userData) {
        try {
            const response = await fetch(`${this.rapidApiUrl}/customWorkoutPlan`, {
                method: 'POST',
                headers: this.rapidApiHeaders,
                body: JSON.stringify({
                    goal: userData.goal,
                    fitness_level: userData.fitness_level,
                    preferences: userData.preferences,
                    health_conditions: userData.health_conditions || ["None"],
                    schedule: {
                        days_per_week: userData.days_per_week,
                        session_duration: userData.session_duration
                    },
                    plan_duration_weeks: userData.plan_duration_weeks,
                    custom_goals: userData.custom_goals || [],
                    lang: "en"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error generating custom workout plan:', error);
            throw error;
        }
    }

    // ========== SPOONACULAR API METHODS ========
    
    //search recipies
    async searchRecipes(query, options = {}) {
        try {
            const params = new URLSearchParams({
                apiKey: this.spoonacularKey,
                query: query,
                number: options.number || 12,
                addRecipeInformation: true,
                fillIngredients: true,
                ...options//is better spread this, for handle all posoble options in the recipies
            });

            const response = await fetch(`${this.spoonacularUrl}/complexSearch?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching recipes:', error);
            throw error;
        }
    }

    //details of the recipe
    async getRecipeDetails(recipeId) {
        try {
            const response = await fetch(
                `${this.spoonacularUrl}/${recipeId}/information?apiKey=${this.spoonacularKey}&includeNutrition=true`
                //
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting recipe details:', error);
            throw error;
        }
    }

    //check recipes by ingredients
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
            console.error('Error finding recipes by ingredients:', error);
            throw error;
        }
    }

    //serch by nutrients
    async searchRecipesByNutrition(nutritionParams) {
        try {
            const params = new URLSearchParams({
                apiKey: this.spoonacularKey,
                number: 12,
                addRecipeInformation: true,
                ...nutritionParams
            });

            const response = await fetch(`${this.spoonacularUrl}/findByNutrients?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching recipes by nutrition:', error);
            throw error;
        }
    }

    // ================= UTILITY METHODS ==========
    
    // Error handle function
    handleApiError(error, context) {
        console.error(`API Error in ${context}:`, error);
        
        if (error.message.includes('401')) {
            throw new Error('Invalid API key. Please check your credentials.');
        } else if (error.message.includes('403')) {
            throw new Error('API quota exceeded. Please try again later.');
        } else if (error.message.includes('429')) {
            throw new Error('Too many requests. Please wait a moment and try again.');
        } else {
            throw new Error(`Service temporarily unavailable. Please try again later.`);
        }
    }
}

export default ApiService;
