// Risk calculation parameters
const RISK_FACTORS = {
    age: {
        weight: 1.5,
        threshold: 50
    },
    familyHistory: {
        none: 0,
        first_degree: 2,
        second_degree: 1.5,
        multiple: 2.5
    },
    menstrualAge: {
        weight: 1.2,
        threshold: 12
    },
    firstBirth: {
        no_births: 1.5,
        before_20: 0.8,
        '20_24': 1.0,
        '25_29': 1.2,
        after_30: 1.4
    },
    breastDensity: {
        fatty: 1.0,
        scattered: 1.2,
        heterogeneous: 1.5,
        dense: 2.0
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
});

function setupForm() {
    const form = document.getElementById('riskAssessmentForm');
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const results = await calculateRisk(data);
    showResults(results);
}

async function calculateRisk(data) {
    // Base risk calculation
    let baseRisk = 12.5; // Average lifetime risk
    let riskMultiplier = 1.0;
    const riskFactors = [];

    // Age factor
    if (data.age > RISK_FACTORS.age.threshold) {
        riskMultiplier *= RISK_FACTORS.age.weight;
        riskFactors.push('Age above 50');
    }

    // Family history
    if (data.familyHistory !== 'none') {
        riskMultiplier *= RISK_FACTORS.familyHistory[data.familyHistory];
        riskFactors.push('Family history of breast cancer');
    }

    // Early menstruation
    if (data.menstrualAge < RISK_FACTORS.menstrualAge.threshold) {
        riskMultiplier *= RISK_FACTORS.menstrualAge.weight;
        riskFactors.push('Early onset of menstruation');
    }

    // First birth age
    riskMultiplier *= RISK_FACTORS.firstBirth[data.firstBirth];
    if (data.firstBirth === 'after_30' || data.firstBirth === 'no_births') {
        riskFactors.push('Late or no childbirth');
    }

    // Breast density
    riskMultiplier *= RISK_FACTORS.breastDensity[data.breastDensity];
    if (data.breastDensity === 'heterogeneous' || data.breastDensity === 'dense') {
        riskFactors.push('High breast density');
    }

    // Calculate final risks
    const lifetimeRisk = baseRisk * riskMultiplier;
    const fiveYearRisk = lifetimeRisk * (5 / 30); // Approximate 5-year risk

    return {
        fiveYearRisk: Math.min(fiveYearRisk, 100),
        lifetimeRisk: Math.min(lifetimeRisk, 100),
        riskFactors,
        riskLevel: getRiskLevel(lifetimeRisk)
    };
}

function getRiskLevel(risk) {
    if (risk < 15) return 'Average';
    if (risk < 20) return 'Moderate';
    return 'High';
}

function showResults(results) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';

    // Update risk meters
    updateRiskMeter('fiveYearRisk', results.fiveYearRisk);
    updateRiskMeter('lifetimeRisk', results.lifetimeRisk);

    // Update risk factors
    const factorsList = document.getElementById('riskFactorsList');
    factorsList.innerHTML = results.riskFactors
        .map(factor => `<li>${factor}</li>`)
        .join('');

    // Generate recommendations
    generateRecommendations(results);
}

function updateRiskMeter(id, risk) {
    const meter = document.getElementById(id);
    const percentage = document.getElementById(`${id}Percentage`);
    meter.style.width = `${risk}%`;
    percentage.textContent = `${risk.toFixed(1)}%`;
}

function generateRecommendations(results) {
    const recommendations = [];

    if (results.riskLevel === 'High') {
        recommendations.push('Schedule regular consultations with a breast specialist');
        recommendations.push('Consider genetic counseling and testing');
        recommendations.push('Maintain monthly breast self-examinations');
        recommendations.push('Follow a healthy lifestyle with regular exercise');
    } else if (results.riskLevel === 'Moderate') {
        recommendations.push('Schedule regular mammogram screenings');
        recommendations.push('Perform monthly breast self-examinations');
        recommendations.push('Maintain a healthy lifestyle');
    } else {
        recommendations.push('Continue routine breast cancer screening');
        recommendations.push('Maintain regular health check-ups');
        recommendations.push('Practice breast awareness');
    }

    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = recommendations
        .map(rec => `<p>${rec}</p>`)
        .join('');
}

function downloadReport() {
    // Report generation logic
    alert('Generating risk assessment report...');
}

function startNewAssessment() {
    location.reload();
}
                                                                                    