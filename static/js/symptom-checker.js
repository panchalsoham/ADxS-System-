// Symptom database
const symptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Shortness of breath',
    'Chest pain', 'Nausea', 'Dizziness', 'Abdominal pain', 'Joint pain',
    'Sore throat', 'Runny nose', 'Body aches', 'Chills', 'Loss of taste',
    'Loss of smell', 'Muscle pain', 'Vomiting', 'Diarrhea', 'Rash',
    'Back pain', 'Neck pain', 'Ear pain', 'Eye pain', 'Toothache',
    'Anxiety', 'Depression', 'Insomnia', 'Loss of appetite', 'Weight loss'
];

// Initialize DOM elements
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('symptomSearch');
    const suggestionsDiv = document.getElementById('symptomSuggestions');
    const selectedSymptomsDiv = document.getElementById('selectedSymptoms');
    const checkButton = document.getElementById('checkSymptoms');
    const resultsDiv = document.getElementById('results');

    let selectedSymptoms = new Set();

    // Search input handler
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        suggestionsDiv.innerHTML = '';

        if (searchTerm === '') {
            suggestionsDiv.style.display = 'none';
            return;
        }

        const matches = symptoms.filter(symptom => 
            symptom.toLowerCase().includes(searchTerm)
        );

        if (matches.length > 0) {
            suggestionsDiv.style.display = 'block';
            matches.forEach(symptom => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = symptom;
                div.addEventListener('click', () => addSymptom(symptom));
                suggestionsDiv.appendChild(div);
            });
        } else {
            suggestionsDiv.style.display = 'none';
        }
    });

    // Add symptom function
    function addSymptom(symptom) {
        if (selectedSymptoms.has(symptom)) return;

        selectedSymptoms.add(symptom);
        const symptomTag = document.createElement('div');
        symptomTag.className = 'symptom-tag';
        symptomTag.innerHTML = `
            ${symptom}
            <i class="fas fa-times" onclick="removeSymptom('${symptom}')"></i>
        `;
        selectedSymptomsDiv.appendChild(symptomTag);

        searchInput.value = '';
        suggestionsDiv.style.display = 'none';
    }

    // Remove symptom function
    window.removeSymptom = function(symptom) {
        selectedSymptoms.delete(symptom);
        const tags = selectedSymptomsDiv.getElementsByClassName('symptom-tag');
        for (let tag of tags) {
            if (tag.textContent.trim() === symptom) {
                tag.remove();
                break;
            }
        }
    };

    // Check symptoms function
    checkButton.addEventListener('click', function() {
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const additionalInfo = document.getElementById('additionalInfo').value;

        if (!age || !gender || selectedSymptoms.size === 0) {
            alert('Please fill in all required information and select at least one symptom.');
            return;
        }

        // Analyze symptoms and display results
        const analysis = analyzeSymptoms(Array.from(selectedSymptoms), age, gender);
        displayResults(analysis);
    });

    // Analyze symptoms function
    function analyzeSymptoms(symptoms, age, gender) {
        // This is a simplified analysis - in a real system, this would be more complex
        const urgentSymptoms = ['Chest pain', 'Shortness of breath', 'Severe headache'];
        const hasUrgentSymptoms = symptoms.some(s => urgentSymptoms.includes(s));

        return {
            urgency: hasUrgentSymptoms ? 'High' : 'Low',
            possibleConditions: generatePossibleConditions(symptoms),
            recommendations: generateRecommendations(hasUrgentSymptoms)
        };
    }

    // Generate possible conditions
    function generatePossibleConditions(symptoms) {
        // This is a simplified mock-up - real implementation would use medical database
        const conditions = [
            { symptoms: ['Fever', 'Cough', 'Fatigue'], condition: 'Common Cold' },
            { symptoms: ['Headache', 'Nausea', 'Dizziness'], condition: 'Migraine' },
            { symptoms: ['Chest pain', 'Shortness of breath'], condition: 'Seek immediate medical attention' }
        ];

        return conditions
            .filter(c => c.symptoms.some(s => symptoms.includes(s)))
            .map(c => ({ condition: c.condition, probability: Math.floor(Math.random() * 40 + 60) + '%' }));
    }

    // Generate recommendations
    function generateRecommendations(isUrgent) {
        if (isUrgent) {
            return [
                'Seek immediate medical attention',
                'Contact emergency services if symptoms worsen',
                'Do not drive yourself to the hospital if experiencing severe symptoms'
            ];
        }
        return [
            'Rest and stay hydrated',
            'Monitor your symptoms',
            'Consider scheduling a doctor\'s appointment',
            'Take over-the-counter medication as appropriate'
        ];
    }

    // Display results function
    function displayResults(analysis) {
        const resultContent = document.getElementById('resultContent');
        
        resultContent.innerHTML = `
            <div class="urgency-level ${analysis.urgency.toLowerCase()}">
                <h3>Urgency Level: ${analysis.urgency}</h3>
                ${analysis.urgency === 'High' ? '<p class="urgent-warning">⚠️ Please seek immediate medical attention</p>' : ''}
            </div>
            <div class="possible-conditions">
                <h3>Possible Conditions:</h3>
                <ul>
                    ${analysis.possibleConditions.map(condition => 
                        `<li>${condition.condition} (${condition.probability})</li>`
                    ).join('')}
                </ul>
            </div>
            <div class="recommendations">
                <h3>Recommendations:</h3>
                <ul>
                    ${analysis.recommendations.map(rec => 
                        `<li>${rec}</li>`
                    ).join('')}
                </ul>
            </div>
            <div class="disclaimer">
                <p>⚠️ This is not a medical diagnosis. Always consult with a healthcare professional for proper medical advice.</p>
            </div>
        `;

        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!suggestionsDiv.contains(e.target) && e.target !== searchInput) {
            suggestionsDiv.style.display = 'none';
        }
    });
});