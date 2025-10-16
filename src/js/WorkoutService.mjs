import DataService from './DataService.mjs';

export default class WorkoutService {
    constructor() {
        this.apiUrl = "https://exercisedb-api1.p.rapidapi.com/api/v1";
        this.headers = {
            "x-rapidapi-key": import.meta.env.VITE_WORKOUT_PLANNER_API_KEY,
            "x-rapidapi-host": "exercisedb-api1.p.rapidapi.com"
        };
        this.dataService = new DataService();
        
        // Debug: Check if API key is loaded (remove this after fixing)
        if (!import.meta.env.VITE_WORKOUT_PLANNER_API_KEY) {
            console.error("WORKOUT API KEY NOT LOADED!");
        }
    }

    // Search exercises by keyword
    async searchExercises(searchTerm, limit = 2) {
        try {
            const response = await fetch(`${this.apiUrl}/exercises/search?search=${encodeURIComponent(searchTerm)}`, {
                method: "GET",
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                return result.data.slice(0, limit);
            }
            return [];
        } catch (error) {
            console.warn(`Failed to search exercises for "${searchTerm}":`, error);
            return [];
        }
    }

    async generateWorkoutPlan(userData) {
        const searchTerms = this.getSearchTerms(userData);
        let exercises = [];
        
        // Try API first
        for (const term of searchTerms) {
            const foundExercises = await this.searchExercises(term, 2);
            exercises = exercises.concat(foundExercises);
        }
        
        // Remove duplicates
        const uniqueExercises = exercises.filter((exercise, index, self) => 
            index === self.findIndex(e => e.exerciseId === exercise.exerciseId)
        );
        
        // Use backup if no API results
        if (uniqueExercises.length === 0) {
            exercises = await this.getBackupExercises(userData);
        } else {
            exercises = uniqueExercises.slice(0, 6);
        }
        
        return {
            goal: userData.goal,
            fitness_level: userData.fitness_level,
            total_weeks: userData.plan_duration_weeks,
            schedule: {
                days_per_week: userData.days_per_week,
                session_duration: userData.session_duration
            },
            exercises: exercises,
            description: `Your ${userData.plan_duration_weeks}-week ${userData.fitness_level} plan for ${userData.goal}. ${exercises.length} exercises included.`
        };
    }

    // Simple search terms based on goal and preferences
    getSearchTerms(userData) {
        const goalTerms = {
            'weight_loss': ['cardio', 'burpee'],
            'muscle_gain': ['strength', 'push'],
            'endurance': ['cardio', 'running'],
            'strength': ['strength', 'push'],
            'general_fitness': ['bodyweight', 'squat'],
            'athletic_performance': ['explosive', 'agility']
        };

        const preferenceTerms = {
            'gym': ['barbell', 'dumbbell'],
            'home': ['bodyweight'],
            'cardio': ['cardio'],
            'strength': ['strength'],
            'yoga': ['stretch'],
            'hiit': ['explosive']
        };

        let terms = goalTerms[userData.goal] || ['bodyweight'];
        
        // Add preference terms
        userData.preferences.forEach(pref => {
            if (preferenceTerms[pref]) {
                terms = terms.concat(preferenceTerms[pref]);
            }
        });
        
        // Remove duplicates and limit
        return [...new Set(terms)].slice(0, 3);
    }
}
