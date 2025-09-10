// Diabetes dataset mean and std values for normalization
const DATASET_PARAMS = {
    means: {
        pregnancies: 3.8,
        glucose: 120.9,
        bloodPressure: 69.1,
        skinThickness: 20.5,
        insulin: 79.8,
        bmi: 32.0,
        pedigree: 0.472,
        age: 33.2
    },
    stds: {
        pregnancies: 3.4,
        glucose: 32.0,
        bloodPressure: 19.4,
        skinThickness: 15.9,
        insulin: 115.2,
        bmi: 7.9,
        pedigree: 0.331,
        age: 11.8
    }
};

let model;

// Load TensorFlow model
async function loadModel() {
    try {
        model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json');
        model = await customizeDiabetesModel(model);
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
    }
}

// Customize model for diabetes prediction
async function customizeDiabetesModel(baseModel) {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
        units: 16,
        activation: 'relu',
        inputShape: [8]
    }));
    
    model.add(tf.layers.dense({
        units: 8,
        activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
    }));

    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    return model;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadModel();
    setupForm();
});

function setupForm() {
    const form = document.getElementById('diabetesForm');
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    startAnalysis(data);
}

async function startAnalysis(data) {
    const analysisSection = document.getElementById('analysisSection');
    analysisSection.style.display = 'block';
    
    await updateProgress(0, 'Processing data...');
    const processedData = preprocessData(data);
    
    await updateProgress(33, 'Running analysis...');
    const results = await runDiagnosis(processedData);
    
    await updateProgress(66, 'Generating recommendations...');
    const recommendations = generateRecommendations(results, data);
    
    await updateProgress(100, 'Complete');
    showResults(results, recommendations);
}

function preprocessData(data) {
    return tf.tidy(() => {
        const normalized = [];
        for (const [key, value] of Object.entries(data)) {
            const mean = DATASET_PARAMS.means[key] || 0;
            const std = DATASET_PARAMS.stds[key] || 1;
            normalized.push((value - mean) / std);
        }
        return tf.tensor2d([normalized]);
    });
}

async function runDiagnosis(tensor) {
    try {
        const predictions = await model.predict(tensor).data();
        const riskScore = predictions[0] * 100;
        
        return {
            score: riskScore,
            level: getRiskLevel(riskScore),
            factors: analyzeRiskFactors(tensor)
        };
    } catch (error) {
        console.error('Diagnosis error:', error);
        return { score: 0, level: 'error', factors: [] };
    }
}

function getRiskLevel(score) {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Moderate Risk';
    return 'High Risk';
}

function analyzeRiskFactors(tensor) {
    const factors = [];
    const data = tensor.dataSync();
    
    if (data[1] > 1) factors.push('High glucose levels');
    if (data[2] > 1) factors.push('Elevated blood pressure');
    if (data[4] > 1) factors.push('High insulin levels');
    if (data[5] > 1) factors.push('High BMI');
    
    return factors;
}

function generateRecommendations(results, data) {
    const recommendations = [];
    
    if (data.glucose > 140) {
        recommendations.push('Monitor blood sugar levels regularly');
        recommendations.push('Consider consulting an endocrinologist');
    }
    
    if (data.bmi > 25) {
        recommendations.push('Maintain a healthy diet');
        recommendations.push('Regular exercise (30 minutes daily)');
    }
    
    if (data.bloodPressure > 130) {
        recommendations.push('Monitor blood pressure regularly');
        recommendations.push('Reduce sodium intake');
    }
    
    return recommendations;
}

async function updateProgress(progress, message) {
    const progressBar = document.getElementById('analysisProgress');
    progressBar.style.width = `${progress}%`;
    await new Promise(resolve => setTimeout(resolve, 500));
}

function showResults(results, recommendations) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';

    // Update risk indicator
    const indicator = document.querySelector('.indicator-circle');
    indicator.className = `indicator-circle ${results.level.toLowerCase().split(' ')[0]}`;
    document.getElementById('riskLevel').textContent = results.level;

    // Update risk meter
    const riskMeter = document.getElementById('riskMeter');
    const riskScore = document.getElementById('riskScore');
    riskMeter.style.width = `${results.score}%`;
    riskScore.textContent = `${Math.round(results.score)}%`;

    // Update factors
    const factorsList = document.getElementById('keyFactors');
    factorsList.innerHTML = results.factors
        .map(factor => `<li>${factor}</li>`)
        .join('');

    // Update recommendations
    const recommendationsContent = document.querySelector('.recommendations-content');
    recommendationsContent.innerHTML = recommendations
        .map(rec => `<p>• ${rec}</p>`)
        .join('');
}

function downloadReport() {
    // Generate and download PDF report
    alert('Downloading report...');
}

function startNewAssessment() {
    location.reload();
}
document.addEventListener('DOMContentLoaded', function() {
    const analyzeButton = document.getElementById('analyzeButton');
    const resultsContainer = document.getElementById('results');
    const riskIndicator = document.getElementById('riskIndicator');
    const resultDetails = document.getElementById('resultDetails');
    const recommendationsList = document.getElementById('recommendationsList');

    analyzeButton.addEventListener('click', function() {
        // Collect form data
        const data = {
            age: parseInt(document.getElementById('age').value),
            glucose: parseInt(document.getElementById('glucose').value),
            bloodPressure: parseInt(document.getElementById('bloodPressure').value),
            insulin: parseInt(document.getElementById('insulin').value),
            bmi: calculateBMI(),
            familyHistory: document.getElementById('familyHistory').checked,
            physicalActivity: document.getElementById('physicalActivity').checked,
            healthyDiet: document.getElementById('healthyDiet').checked
        };

        if (!validateData(data)) {
            alert('Please fill in all required fields with valid values.');
            return;
        }

        // Analyze data and show results
        const analysis = analyzeRisk(data);
        displayResults(analysis);
    });

    function calculateBMI() {
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value) / 100; // convert cm to m
        return weight / (height * height);
    }

    function validateData(data) {
        return !Object.values(data).some(value => 
            (typeof value === 'number' && (isNaN(value) || value <= 0))
        );
    }

    function analyzeRisk(data) {
        let riskScore = 0;
        
        // Calculate risk based on various factors
        if (data.glucose > 126) riskScore += 30;
        if (data.bmi > 30) riskScore += 20;
        if (data.bloodPressure > 140) riskScore += 15;
        if (data.age > 45) riskScore += 10;
        if (data.familyHistory) riskScore += 15;
        if (!data.physicalActivity) riskScore += 5;
        if (!data.healthyDiet) riskScore += 5;

        return {
            riskScore: Math.min(riskScore, 100),
            recommendations: generateRecommendations(data)
        };
    }

    function generateRecommendations(data) {
        const recommendations = [];

        if (data.glucose > 126) {
            recommendations.push('Monitor blood glucose levels regularly');
        }
        if (data.bmi > 30) {
            recommendations.push('Consider a weight management program');
        }
        if (data.bloodPressure > 140) {
            recommendations.push('Monitor blood pressure and consult a healthcare provider');
        }
        if (!data.physicalActivity) {
            recommendations.push('Incorporate regular physical activity into your routine');
        }
        if (!data.healthyDiet) {
            recommendations.push('Adopt a balanced, diabetes-friendly diet');
        }

        return recommendations;
    }

    function displayResults(analysis) {
        // Show results container
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });

        // Update risk meter
        riskIndicator.style.width = `${analysis.riskScore}%`;

        // Update result details
        resultDetails.innerHTML = `
            <p>Based on your input, your diabetes risk score is: <strong>${analysis.riskScore}%</strong></p>
            <p>Risk Level: <strong>${getRiskLevel(analysis.riskScore)}</strong></p>
        `;

        // Update recommendations
        recommendationsList.innerHTML = analysis.recommendations
            .map(rec => `<li><i class="fas fa-check-circle"></i> ${rec}</li>`)
            .join('');
    }

    function getRiskLevel(score) {
        if (score < 30) return 'Low Risk';
        if (score < 60) return 'Moderate Risk';
        return 'High Risk';
    }
});

document.getElementById("downloadPdfBtn").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Diabetes Risk Assessment Report", 20, 20);

    // Risk Score
    let score = document.querySelector(".assessment-result-score").innerText;
    let level = document.querySelector(".assessment-result-level").innerText;

    doc.setFontSize(12);
    doc.text("Risk Score: " + score, 20, 40);
    doc.text("Risk Level: " + level, 20, 50);

    // Recommendations
    doc.text("Recommendations:", 20, 70);
    let recs = document.querySelectorAll(".recommendation-item");
    let y = 80;
    recs.forEach((rec, index) => {
        doc.text((index + 1) + ". " + rec.innerText, 25, y);
        y += 10;
    });

    // Footer
    doc.setFontSize(10);
    doc.text("Note: This is an AI-based recommendation. Please consult a doctor for professional advice.", 20, y + 20);

    // Save PDF
    doc.save("Diabetes_Risk_Report.pdf");
});

