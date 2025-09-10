function generateRecommendations(assessmentData) {
    const recommendations = {
        medical: getMedicalRecommendations(assessmentData),
        lifestyle: getLifestyleRecommendations(assessmentData),
        prevention: getPreventionRecommendations(assessmentData),
        monitoring: getMonitoringPlan(assessmentData)
    };

    updateRecommendationsDisplay(recommendations);
}

function getMedicalRecommendations(data) {
    const recommendations = [];
    
    // Age-based recommendations
    if (data.age >= 40) {
        recommendations.push({
            title: "Regular Mammogram",
            description: "Schedule annual mammogram screening",
            priority: "high",
            icon: "fa-hospital"
        });
    }

    // Family history recommendations
    if (data.familyHistory === "first_degree" || data.familyHistory === "multiple") {
        recommendations.push({
            title: "Genetic Counseling",
            description: "Consider genetic testing and counseling",
            priority: "high",
            icon: "fa-dna"
        });
    }

    // Breast density recommendations
    if (data.breastDensity === "dense" || data.breastDensity === "heterogeneous") {
        recommendations.push({
            title: "Additional Screening",
            description: "Consider supplemental screening methods",
            priority: "medium",
            icon: "fa-search-plus"
        });
    }

    return recommendations;
}

function getLifestyleRecommendations(data) {
    const recommendations = [];

    // BMI-based recommendations
    if (data.bmi > 25) {
        recommendations.push({
            title: "Weight Management",
            description: "Develop a healthy weight management plan",
            priority: "medium",
            icon: "fa-weight"
        });
    }

    // General lifestyle recommendations
    recommendations.push({
        title: "Physical Activity",
        description: "Maintain regular physical activity (150 minutes/week)",
        priority: "medium",
        icon: "fa-running"
    });

    recommendations.push({
        title: "Healthy Diet",
        description: "Follow a balanced, nutrient-rich diet",
        priority: "medium",
        icon: "fa-apple-alt"
    });

    return recommendations;
}

function getPreventionRecommendations(data) {
    const recommendations = [];

    recommendations.push({
        title: "Self-Examination",
        description: "Perform monthly breast self-examinations",
        priority: "high",
        icon: "fa-check-circle"
    });

    if (data.hormoneTherapy === "current") {
        recommendations.push({
            title: "Hormone Therapy Review",
            description: "Discuss hormone therapy risks with your doctor",
            priority: "high",
            icon: "fa-pills"
        });
    }

    return recommendations;
}

function getMonitoringPlan(data) {
    const recommendations = [];
    
    // Risk-based monitoring
    if (calculateRiskLevel(data) === "high") {
        recommendations.push({
            title: "Regular Check-ups",
            description: "Schedule quarterly clinical breast examinations",
            priority: "high",
            icon: "fa-calendar-check"
        });
    } else {
        recommendations.push({
            title: "Routine Screening",
            description: "Maintain annual clinical breast examinations",
            priority: "medium",
            icon: "fa-calendar"
        });
    }

    return recommendations;
}
function displayDetailedRecommendations(recommendations) {
    try {
        // ... existing display code ...
        console.log('Recommendations displayed successfully');
    } catch (error) {
        console.error('Error displaying recommendations:', error);
    }
}
function updateRecommendationsDisplay(recommendations) {
    const sections = ['medical', 'lifestyle', 'prevention', 'monitoring'];
    
    sections.forEach(section => {
        const container = document.getElementById(`${section}Recommendations`);
        if (container) {
            container.innerHTML = recommendations[section]
                .map(rec => `
                    <li class="recommendation-item ${rec.priority}">
                        <i class="fas ${rec.icon}"></i>
                        <div class="recommendation-content">
                            <h5>${rec.title}</h5>
                            <p>${rec.description}</p>
                        </div>
                    </li>
                `).join('');
        }
    });
}

function calculateRiskLevel(data) {
    // Risk calculation logic based on assessment data
    let riskScore = 0;
    
    if (data.age > 50) riskScore += 2;
    if (data.familyHistory === "first_degree") riskScore += 3;
    if (data.breastDensity === "dense") riskScore += 2;
    if (data.biopsies === "multiple") riskScore += 2;
    
    return riskScore >= 5 ? "high" : "medium";
}