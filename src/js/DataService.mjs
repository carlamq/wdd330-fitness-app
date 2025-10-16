//local JSON data
class DataService {
    constructor() {
        this.exercisesData = null;
        this.recipesData = null;
    }

    //load exercises from JSON
    async loadExercises() {
        if (!this.exercisesData) {
            try {
                const response = await fetch('/data/exercises.json');
                this.exercisesData = await response.json();
            } catch (error) {
                console.error('Error loading exercises data:', error);
                this.exercisesData = { featured_exercises: [], workout_categories: [] };
            }
        }
        return this.exercisesData;
    }

    //load recipes from JSON
    async loadRecipes() {
        if (!this.recipesData) {
            try {
                const response = await fetch('/data/recipes.json');
                this.recipesData = await response.json();
            } catch (error) {
                console.error('Error loading recipes data:', error);
                this.recipesData = { featured_recipes: [], meal_plans: [] };
            }
        }
        return this.recipesData;
    }

    //get featured exercises
    async getFeaturedExercises(category = null) {
        const data = await this.loadExercises();
        let exercises = data.featured_exercises;
        
        if (category) {
            exercises = exercises.filter(exercise => exercise.category.toLowerCase() === category.toLowerCase());
        }
        return exercises;
    }

    // Get exercises by difficulty
    async getExercisesByDifficulty(difficulty) {
        const data = await this.loadExercises();
        return data.featured_exercises.filter(exercise => exercise.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    //get featured recipes
    async getFeaturedRecipes(category = null) {
        const data = await this.loadRecipes();
        let recipes = data.featured_recipes;
        
        if (category) {
            recipes = recipes.filter(recipe => recipe.category.toLowerCase() === category.toLowerCase());
        }
        
        return recipes;
    }
}

export default DataService;