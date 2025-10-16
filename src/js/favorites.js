import { loadHeaderFooter, getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

loadHeaderFooter();

function createRecipeCard(recipe) {
    return `
        <div class="favorite-card">
            <h3>${recipe.title || "Favorite Recipe"}</h3>
            <p><strong>Ready in:</strong> ${recipe.readyInMinutes || "30"} minutes</p>
            <p><strong>Servings:</strong> ${recipe.servings || "2"}</p>
            <p><strong>Saved:</strong> ${new Date(recipe.savedAt).toLocaleDateString()}</p>
            <button class="btn-secondary remove-favorite" data-type="recipes" data-id="${recipe.id}">Remove</button>
        </div>
    `;
}

// Helper function to create workout card HTML
function createWorkoutCard(workout) {
    const exercises = workout.exercises || workout.plan || [];
    
    return `
        <div class="favorite-card">
            <h3>${workout.name || "My Workout Plan"}</h3>
            <p><strong>Goal:</strong> ${workout.userPreferences?.goal || "General fitness"}</p>
            <p><strong>Level:</strong> ${workout.userPreferences?.fitness_level || "Beginner"}</p>
            <p><strong>Exercises:</strong> ${exercises.length}</p>
            <p><strong>Saved:</strong> ${new Date(workout.generatedAt).toLocaleDateString()}</p>
            
            ${exercises.length > 0 ? `
                <div class="workout-exercises">
                    ${exercises.map(ex => `
                        <div class="exercise-simple">
                            <strong>${ex.name}</strong> - ${ex.target || ex.bodyPart || 'Full body'}
                        </div>
                    `).join('')}
                </div>
            ` : '<p>No exercise data available</p>'}
            
            <button class="btn-secondary remove-favorite" data-type="workouts" data-id="${workout.id}">Remove</button>
        </div>
    `;
}

function loadFavorites() {
    const container = document.getElementById("favorites-container");
    const favoriteWorkouts = getLocalStorage("favoriteWorkouts") || [];
    const favoriteRecipes = getLocalStorage("favoriteRecipes") || [];

    if (favoriteWorkouts.length === 0 && favoriteRecipes.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <h2>No favorites yet!</h2>
                <p>Start adding workouts and recipes to your favorites to see them here.</p>
                <a href="/pages/workouts.html" class="btn-primary">Find Workouts</a>
                <a href="/pages/recipes.html" class="btn-primary">Find Recipes</a>
            </div>
        `;
        return;
    }

    let sectionsHTML = "";

    // Show workouts using template function
    if (favoriteWorkouts.length > 0) {
        const workoutsHTML = favoriteWorkouts.map(workout => createWorkoutCard(workout)).join('');
        sectionsHTML += `
            <h2>Favorite Workouts</h2>
            <div class="favorites-grid">
                ${workoutsHTML}
            </div>
        `;
    }

    // Show recipes using template function
    if (favoriteRecipes.length > 0) {
        const recipesHTML = favoriteRecipes.map(recipe => createRecipeCard(recipe)).join('');
        sectionsHTML += `
            <h2>Favorite Recipes</h2>
            <div class="favorites-grid">
                ${recipesHTML}
            </div>
        `;
    }

    container.innerHTML = sectionsHTML;
    setupRemoveListeners();
}

function setupRemoveListeners() {
    const container = document.getElementById("favorites-container");

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-favorite')) {
            const type = e.target.getAttribute('data-type');
            const id = parseInt(e.target.getAttribute('data-id'));
            removeFavorite(type, id);
        }
    });
}

//remove function for localstorage
function removeFavorite(type, id) {
    const storageKey = type === 'workouts' ? 'favoriteWorkouts' : 'favoriteRecipes';
    let favorites = getLocalStorage(storageKey) || [];
    
    favorites = favorites.filter(item => item.id !== id);
    setLocalStorage(storageKey, favorites);
    
    alertMessage("Removed from favorites!");
    loadFavorites(); // Reload
}

// Clear all button
document.getElementById("clear-all-btn")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all favorites?")) {
        localStorage.removeItem("favoriteWorkouts");
        localStorage.removeItem("favoriteRecipes");
        alertMessage("All favorites cleared!");
        loadFavorites();
    }
});


loadFavorites();