class UserProfile {
    constructor() {
        // Storage key to localStorage
        this.storageKey = 'fitnessUserProfile';
        
        // Datos por defecto del usuario
        this.defaultData = {
            name: '',
            age: '',
            gender: '',
            weight: '',
            height: '',
            goal: '',
            fitness_level: '',
            health_conditions: [],
            dietary_restrictions: []
        };
        
        //load existing data or defaults
        this.userData = this.loadProfile() || this.defaultData;
    }

    //To load the data from local storage
    loadProfile() {
        try {
            const data = localStorage.getItem(this.storageKey);
            // JSON
            return data ? JSON.parse(data) : null;
        } catch (error) {
            // error
            console.error('Error loading profile:', error);
            return null;
        }
    }
    saveProfile(data) {
        try {
            if (data.name !== undefined) this.userData.name = data.name;
            if (data.age !== undefined) this.userData.age = data.age;
            if (data.gender !== undefined) this.userData.gender = data.gender;
            if (data.weight !== undefined) this.userData.weight = data.weight;
            if (data.height !== undefined) this.userData.height = data.height;
            if (data.goal !== undefined) this.userData.goal = data.goal;
            if (data.fitness_level !== undefined) this.userData.fitness_level = data.fitness_level;
            if (data.health_conditions !== undefined) this.userData.health_conditions = data.health_conditions;
            if (data.dietary_restrictions !== undefined) this.userData.dietary_restrictions = data.dietary_restrictions;
            
            //Save localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(this.userData));

            return true;
        } catch (error) {
            console.error('Error saving profile:', error);
            return false;
        }
    }
    validateData(data) {
        const errors = [];
        if (!data.name || data.name.trim().length < 2) {
            errors.push("Name must have 2 characters");
        }
        if (!data.age || data.age < 13 || data.age > 100) {
            errors.push("Age must be between 13 and 100");
        }
        if (!data.weight || data.weight < 30 || data.weight > 300) {
            errors.push("Weight must be between 30 and 300 kg");
        }
        if (!data.height || data.height < 100 || data.height > 250) {
            errors.push("Height must be between 100 and 250 cm");
        }
        if (!data.gender || !["male", "female"].includes(data.gender.toLowerCase())) {
            errors.push("Please select a valid gender");
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    //BMI calculation
    calculateBMI() {
        if (!this.userData.weight || !this.userData.height) {
            return null;
        }
        
        const weight = parseFloat(this.userData.weight);
        const height = parseFloat(this.userData.height) / 100; //cm to m
        
        const bmi = weight / (height * height);
        
        return {
            value: Math.round(bmi * 10) / 10, // round to 1 decimal
            category: this.getBMICategory(bmi)
        };
    }
    getBMICategory(bmi) {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal weight";
        if (bmi < 30) return "Overweight";
        return "Obese";
    }
    // To get recomendations
    getRecommendations() {
        const bmi = this.calculateBMI();
        const recommendations = [];

        // Recomendations by BMI
        if (bmi && bmi.value < 18.5) {
            recommendations.push("Consider a weight gain plan with strength training");
            recommendations.push("Focus on high-protein meals");
        } else if (bmi && bmi.value > 25) {
            recommendations.push("Consider a weight loss plan with cardio exercises");
            recommendations.push('Focus on low-calorie, high-fiber meals');
        } else {
            recommendations.push("Maintain your current weight with balanced nutrition");
            recommendations.push("Mix cardio and strength training");
        }

        // Recomendations by eage
        const age = parseInt(this.userData.age);
        if (age && age > 50) {
            recommendations.push("Include flexibility exercises and joint care");
        } else if (age && age < 25) {
            recommendations.push("Great time to build muscle mass and fitness habits");
        }

        return recommendations;
    }
}   
export default UserProfile;