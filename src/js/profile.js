import { loadHeaderFooter, getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

// Convert form data to JSON object
function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });
    return convertedJSON;
}

export default class UserProfile {
    constructor(formSelector, summarySelector) {
        this.formSelector = formSelector;
        this.summarySelector = summarySelector;
        this.userData = null;
        this.bmiData = null;
    }

    init() {
        loadHeaderFooter();
        this.userData = getLocalStorage("userProfile");
        this.setupEventListeners();
        if (this.userData && this.userData.name) {
            this.loadExistingData();
            this.displaySummary();
        }
    }

    setupEventListeners() {
        const form = document.querySelector(this.formSelector);
        const clearBtn = document.getElementById("clear-profile");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });

        clearBtn.addEventListener("click", () => {
            this.clearProfile();
        });
    }

    handleSubmit(formElement) {
        const formData = formDataToJSON(formElement);
        
        if (this.validateData(formData)) {
            this.userData = formData;
            this.saveProfile();
            this.calculateBMI();
            this.displaySummary();
            alertMessage("Profile saved successfully!");
        } else {
            alertMessage("Please fill in all required fields!");
        }
    }

    validateData(data) {
        const required = ['name', 'age', 'gender', 'weight', 'height', 'goal', 'fitness_level'];
        return required.every(field => data[field] && data[field].trim() !== '');
    }

    saveProfile() {
        setLocalStorage("userProfile", this.userData);
    }

    calculateBMI() {
        const weight = parseFloat(this.userData.weight);
        const height = parseFloat(this.userData.height);
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        let category = "";
        if (bmi < 18.5) category = "Underweight";
        else if (bmi < 25) category = "Normal weight";
        else if (bmi < 30) category = "Overweight";
        else category = "Obese";
        
        this.bmiData = {
            value: bmi.toFixed(1),
            category: category
        };
    }

    displaySummary() {
        const summary = document.querySelector(this.summarySelector);
        const placeholder = document.getElementById("profile-placeholder");
        const summaryContent = document.getElementById("summary-content");
        const bmiInfo = document.getElementById("bmi-info");
        const recommendations = document.getElementById("recommendations");
        
        summaryContent.innerHTML = `
            <p><strong>Name:</strong> ${this.userData.name}</p>
            <p><strong>Age:</strong> ${this.userData.age} years</p>
            <p><strong>Gender:</strong> ${this.userData.gender}</p>
            <p><strong>Weight:</strong> ${this.userData.weight} kg</p>
            <p><strong>Height:</strong> ${this.userData.height} cm</p>
            <p><strong>Goal:</strong> ${this.userData.goal}</p>
            <p><strong>Fitness Level:</strong> ${this.userData.fitness_level}</p>
            <p><strong>Health Conditions:</strong> ${this.userData.health_conditions || "None"}</p>
        `;
        
        // BMI calculation
        if (!this.bmiData) this.calculateBMI();
        bmiInfo.innerHTML = `
            <h4>BMI Information</h4>
            <p><strong>BMI:</strong> ${this.bmiData.value} (${this.bmiData.category})</p>
            <p>${this.getBMIDescription(this.bmiData.category)}</p>
        `;
        
        // Recommendations
        const recs = this.getRecommendations();
        recommendations.innerHTML = `
            <h4>Recommendations</h4>
            <ul>
                ${recs.map(rec => `<li>${rec}</li>`).join("")}
            </ul>
        `;
        
        summary.classList.remove("hidden");
        summary.classList.add("visible");
        placeholder.classList.add("hidden");
        placeholder.classList.remove("visible");
    }

    getBMIDescription(category) {
        const descriptions = {
            "Underweight": "Consider gaining weight through a balanced diet and strength training.",
            "Normal weight": "Great! Maintain your current weight with balanced nutrition and regular exercise.",
            "Overweight": "Consider a weight loss plan with cardio exercises and calorie management.",
            "Obese": "Consult with a healthcare provider for a comprehensive weight management plan."
        };
        return descriptions[category] || "";
    }

    getRecommendations() {
        const recs = [];
        const { goal } = this.userData;
        const { category } = this.bmiData;
        
        if (goal === "weight_loss") {
            recs.push("Focus on cardio exercises");
            recs.push("Create a calorie deficit");
            recs.push("Drink plenty of water");
        } else if (goal === "muscle_gain") {
            recs.push("Include strength training");
            recs.push("Eat protein-rich foods");
            recs.push("Get adequate rest");
        } else {
            recs.push("Mix cardio and strength training");
            recs.push("Eat a balanced diet");
            recs.push("Stay consistent with exercise");
        }
        
        if (category === "Overweight" || category === "Obese") {
            recs.push("Consider consulting a nutritionist");
        }
        
        return recs;
    }

    loadExistingData() {
        Object.keys(this.userData).forEach(key => {
            const input = document.getElementById(key);
            if (input && this.userData[key]) {
                input.value = this.userData[key];
            }
        });
    }

    clearProfile() {
        if (confirm("Clear all form data?")) {
            const form = document.querySelector(this.formSelector);
            const summary = document.querySelector(this.summarySelector);
            const placeholder = document.getElementById("profile-placeholder");
            
            form.reset();
            setLocalStorage("userProfile", null);
            summary.classList.add("hidden");
            summary.classList.remove("visible");
            placeholder.classList.remove("hidden");
            placeholder.classList.add("visible");
            alertMessage("Profile cleared!");
            
            this.userData = null;
            this.bmiData = null;
        }
    }
}

const userProfile = new UserProfile("#profile-form", "#profile-summary");
userProfile.init();