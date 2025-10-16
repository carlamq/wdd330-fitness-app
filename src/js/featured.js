import { loadHeaderFooter } from "./utils.mjs";
import DataService from "./DataService.mjs";

// Load header and footer
loadHeaderFooter();

// Simple variables instead of class properties
const dataService = new DataService();
let currentTab = 'exercises';

// Initialize the page
function initFeatured() {
    setupTabs();
    setupFilters();
    loadExercises();
}

// Setup tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });
}

// Switch between tabs
function switchTab(tab) {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tab}-content`).classList.add('active');

    currentTab = tab;

    // Load content for the active tab
    if (tab === 'exercises') {
        loadExercises();
    } else {
        loadRecipes();
    }
}

//Setup filter event listeners
function setupFilters() {
    document.getElementById('exercise-category').addEventListener('change', loadExercises);
    document.getElementById('exercise-difficulty').addEventListener('change', loadExercises);
    document.getElementById('recipe-category').addEventListener('change', loadRecipes);
    document.getElementById('meal-type').addEventListener('change', loadRecipes);
}

// Load and display exercises
async function loadExercises() {
    const category = document.getElementById('exercise-category').value;
    const difficulty = document.getElementById('exercise-difficulty').value;
    
    let exercises = await dataService.getFeaturedExercises(category);
    
    if (difficulty) {
        exercises = exercises.filter(ex => ex.difficulty.toLowerCase() === difficulty);
    }

    displayExercises(exercises);
}

// Load and display recipes
async function loadRecipes() {
    const category = document.getElementById('recipe-category').value;
    const mealType = document.getElementById('meal-type').value;
    
    let recipes = await dataService.getFeaturedRecipes(category);
    
    if (mealType) {
        recipes = recipes.filter(recipe => recipe.meal_type.toLowerCase() === mealType);
    }

    displayRecipes(recipes);
}

//Display exercises in grid
function displayExercises(exercises) {
    const grid = document.getElementById('exercises-grid');
    
    if (exercises.length === 0) {
        grid.innerHTML = '<p>No exercises found for the selected filters.</p>';
        return;
    }

    let html = '';
    exercises.forEach(exercise => {
        html += `
            <div class="exercise-card">
                <img src="${exercise.image_url}" alt="${exercise.name}" loading="lazy">
                <h5>${exercise.name}</h5>
                <p><strong>Category:</strong> ${exercise.category}</p>
                <p><strong>Difficulty:</strong> ${exercise.difficulty}</p>
                <p><strong>Equipment:</strong> ${exercise.equipment || 'N/A'}</p>
                <p><strong>Duration:</strong> ${exercise.duration_minutes || 'N/A'} min</p>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// Display recipes in grid
function displayRecipes(recipes) {
    const grid = document.getElementById('recipes-grid');
    
    if (recipes.length === 0) {
        grid.innerHTML = '<p>No recipes found for the selected filters.</p>';
        return;
    }

    let html = '';
    recipes.forEach(recipe => {
        html += `
            <div class="recipe-card">
                <img src="${recipe.image_url}" alt="${recipe.title}" loading="lazy">
                <h3>${recipe.title}</h3>
                <p><strong>Category:</strong> ${recipe.category}</p>
                <p><strong>Prep Time:</strong> ${recipe.prep_time_minutes} min</p>
                <p><strong>Calories:</strong> ${recipe.calories_per_serving}</p>
                <p><strong>Protein:</strong> ${recipe.protein_grams}g</p>
            </div>
        `;
    });

    grid.innerHTML = html;
}

initFeatured();