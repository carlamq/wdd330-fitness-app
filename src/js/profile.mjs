import UserProfile from "./UserProfile.mjs";

const userProfile = new UserProfile();

// Get form elements
const form = document.getElementById("profile-form");
const summary = document.getElementById("profile-summary");
const placeholder = document.getElementById("profile-placeholder");
const clearBtn = document.getElementById("clear-profile");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate
    const validation = userProfile.validateData(data);
    
    if (validation.isValid) {
        const saved = userProfile.saveProfile(data);
        
        if (saved) {
            showSummary();
            showMessage("Profile saved successfully!", "success");
        } else {
            showMessage("Error saving profile. Please try again.", "error");
        }
    } else {
        showMessage("Please fix these errors:\n" + validation.errors.join("\n"), "error");
    }
});

//clear button
clearBtn.addEventListener("click", () => {
    if (confirm("Clear all form data?")) {
        form.reset();
        summary.style.display = "none";
        placeholder.style.display = "block";
    }
});

// Show profile summary
function showSummary() {
    const data = userProfile.userData;
    const summaryContent = document.getElementById("summary-content");
    const bmiInfo = document.getElementById("bmi-info");
    const recommendations = document.getElementById("recommendations");
    
    // Basic info
    summaryContent.innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Age:</strong> ${data.age} years</p>
        <p><strong>Gender:</strong> ${data.gender}</p>
        <p><strong>Weight:</strong> ${data.weight} kg</p>
        <p><strong>Height:</strong> ${data.height} cm</p>
        <p><strong>Goal:</strong> ${data.goal}</p>
        <p><strong>Fitness Level:</strong> ${data.fitness_level}</p>
        <p><strong>Health Conditions:</strong> ${data.health_conditions || "None"}</p>
    `;
    
    // BMI calculation
    const bmi = userProfile.calculateBMI();
    if (bmi) {
        bmiInfo.innerHTML = `
            <h4>BMI Information</h4>
            <p><strong>BMI:</strong> ${bmi.value} (${bmi.category})</p>
            <p>${getBMIDescription(bmi.category)}</p>
        `;
    }
    
    // Recommendations
    const recs = userProfile.getRecommendations();
    recommendations.innerHTML = `
        <h4>Recommendations</h4>
        <ul>
            ${recs.map(rec => `<li>${rec}</li>`).join("")}
        </ul>
    `;
    
    // Show summary, hide placeholder
    summary.style.display = "block";
    placeholder.style.display = "none";
}

// BMI descriptions
function getBMIDescription(category) {
    const descriptions = {
        "Underweight": "Consider gaining weight through a balanced diet and strength training.",
        "Normal weight": "Great! Maintain your current weight with balanced nutrition and regular exercise.",
        "Overweight": "Consider a weight loss plan with cardio exercises and calorie management.",
        "Obese": "Consult with a healthcare provider for a comprehensive weight management plan."
    };
    return descriptions[category] || "";
}

// Show message
function showMessage(message) {
    const msg = document.createElement("div");
    msg.textContent = message;
    
    document.body.appendChild(msg);
}

// Load existing data
document.addEventListener("DOMContentLoaded", () => {
    if (userProfile.userData && userProfile.userData.name) {
        // Fill form
        Object.keys(userProfile.userData).forEach(key => {
            const input = document.getElementById(key);
            if (input && userProfile.userData[key]) {
                input.value = userProfile.userData[key];
            }
        });
        
        // Show summary
        showSummary();
    }
});

console.log("Profile page ready!");