import { loadHeaderFooter, getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import WorkoutService from "./WorkoutService.mjs";

loadHeaderFooter();

function exerciseCardTemplate(exercise) {
    const imageUrl = exercise.imageUrl || exercise.gifUrl;
    return `
        <div class="exercise-card">
            <h5>${exercise.name}</h5>
            ${imageUrl ? `
                <div class="exercise-gif">
                    <img src="${imageUrl}" alt="${exercise.name}">
                </div>
            ` : ''}
        </div>
    `;
}

// Template for workout plan (clean like your ProductList)
function workoutPlanTemplate(plan) {
    if (!plan.exercises || !Array.isArray(plan.exercises)) {
        return `<p>Your workout plan is ready!</p>`;
    }

    const exercisesHTML = plan.exercises.map(exercise => exerciseCardTemplate(exercise)).join('');
    
    return `
        <div class="workout-plan">
            <div class="plan-overview">
                <h3>Your Fitness Journey Starts Now!</h3>
                <div class="plan-summary">
                    <h4>Your Exercises</h4>
                    ${exercisesHTML}
                </div>
            </div>
        </div>
    `;
}

export default class WorkoutManager {
    constructor() {
        this.workoutService = new WorkoutService();
        this.workoutForm = document.getElementById("workout-form");
        this.workoutResults = document.getElementById("workout-results");
        this.workoutPlanContent = document.getElementById("workout-plan-content");
        this.saveWorkoutBtn = document.getElementById("save-workout");
        this.currentWorkoutPlan = null;
    }
    
    init() {
        if (!this.workoutForm || !this.workoutResults || !this.workoutPlanContent) {
            console.error("Workout elements not found in the DOM");
            return;
        }

        this.workoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.generateWorkoutPlan();
        });

        this.saveWorkoutBtn.addEventListener("click", () => {
            this.saveWorkoutToFavorites();
        });
    }

    async generateWorkoutPlan() {
        const formData = this.getFormData();
        if (!formData.goal || !formData.fitness_level || !formData.preferences.length) {
            alertMessage("Please fill in all required fields");
            return;
        }
        this.workoutPlanContent.innerHTML = `
            <div class="loading">
                <p>🏋️‍♀️ Generating your personalized workout plan...</p>
                <p>This may take a moment...</p>
            </div>
        `;
        this.workoutResults.classList.remove("hidden");
        this.workoutResults.classList.add("visible");

        try {
            const workoutPlan = await this.workoutService.generateWorkoutPlan(formData);
            
            this.currentWorkoutPlan = {
                exercises: workoutPlan.exercises || [],
                userPreferences: formData,
                generatedAt: new Date().toISOString(),
                fullPlan: workoutPlan
            };

            this.renderWorkoutPlan(workoutPlan);
            this.workoutResults.scrollIntoView({ behavior: "smooth" });

        } catch (error) {
            console.error("Error generating workout plan:", error);
            alertMessage("Sorry, couldn't generate your workout plan. Please try again!");
        }
    }

    getFormData() {
        const preferences = Array.from(
            document.querySelectorAll('input[name="preferences"]:checked')
        ).map(checkbox => checkbox.value);

        const goal = document.getElementById("fitness-goal").value;
        const fitness_level = document.getElementById("fitness-level").value;
        const days_per_week = parseInt(document.getElementById("days-per-week").value);
        const session_duration = parseInt(document.getElementById("session-duration").value);
        const plan_duration_weeks = parseInt(document.getElementById("plan-duration").value);

        return {
            goal,
            fitness_level,
            preferences,
            days_per_week,
            session_duration,
            plan_duration_weeks,
            health_conditions: ["None"]
        };
    }

    renderWorkoutPlan(plan) {
        if (!plan) {
            this.workoutPlanContent.innerHTML = `
                <div class="error">
                    <p>No workout plan was generated. Please try again.</p>
                </div>
            `;
            return;
        }
        this.workoutPlanContent.innerHTML = workoutPlanTemplate(plan);
    }

    saveWorkoutToFavorites() {
        if (!this.currentWorkoutPlan) {
            alertMessage("No workout plan to save!");
            return;
        }
        const favorites = getLocalStorage("favoriteWorkouts") || [];
        const workoutToSave = {
            id: Date.now(),
            name: `${this.currentWorkoutPlan.userPreferences.goal} Plan`,
            userPreferences: this.currentWorkoutPlan.userPreferences,
            generatedAt: this.currentWorkoutPlan.generatedAt,
            exercises: this.currentWorkoutPlan.exercises || []
        };

        favorites.push(workoutToSave);
        setLocalStorage("favoriteWorkouts", favorites);
        alertMessage("Workout plan saved to favorites!");
    }
}
const workoutManager = new WorkoutManager();
workoutManager.init();