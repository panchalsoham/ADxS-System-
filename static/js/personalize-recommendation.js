function createDetailedRecommendations(assessmentData) {
    const recommendations = {
        medical: [
            {
                title: "Regular Clinical Examinations",
                description: "Schedule bi-annual clinical breast examinations due to multiple previous biopsies",
                priority: "High",
                timeline: "Every 6 months",
                icon: "stethoscope"
            },
            {
                title: "Advanced Screening",
                description: "Additional ultrasound screening recommended due to heterogeneously dense breast tissue",
                priority: "High",
                timeline: "Discuss with healthcare provider",
                icon: "search-plus"
            },
            {
                title: "Biopsy Follow-up",
                description: "Maintain detailed records of previous biopsy results and schedule regular follow-ups",
                priority: "Medium",
                timeline: "Annual review",
                icon: "file-medical"
            }
        ],
        
        lifestyle: [
            {
                title: "Weight Management",
                description: "Maintain current BMI of 20 through balanced diet and exercise",
                priority: "Medium",
                actionItems: [
                    "150 minutes of moderate exercise weekly",
                    "Balance protein and fiber intake",
                    "Regular BMI monitoring"
                ],
                icon: "weight"
            },
            {
                title: "Dietary Recommendations",
                description: "Focus on cancer-fighting nutrients and antioxidants",
                priority: "Medium",
                actionItems: [
                    "Increase cruciferous vegetables",
                    "Include omega-3 rich foods",
                    "Limit processed foods"
                ],
                icon: "apple-alt"
            }
        ],
        
        prevention: [
            {
                title: "Monthly Self-Examination",
                description: "Perform regular breast self-examinations",
                priority: "High",
                guidelines: [
                    "Set monthly reminder",
                    "Document any changes",
                    "Report concerns immediately"
                ],
                icon: "calendar-check"
            },
            {
                title: "Risk Monitoring",
                description: "Track and monitor breast density changes",
                priority: "Medium",
                guidelines: [
                    "Keep imaging records",
                    "Note density changes",
                    "Discuss changes with doctor"
                ],
                icon: "chart-line"
            }
        ]
    };

    displayDetailedRecommendations(recommendations);
}

function displayDetailedRecommendations(recommendations) {
    const sections = ['medical', 'lifestyle', 'prevention'];
    
    sections.forEach(section => {
        const container = document.getElementById(`${section}Recommendations`);
        if (container) {
            let html = `<div class="recommendation-section ${section}">`;
            
            recommendations[section].forEach(rec => {
                html += `
                    <div class="recommendation-card priority-${rec.priority.toLowerCase()}">
                        <div class="rec-header">
                            <i class="fas fa-${rec.icon}"></i>
                            <h4>${rec.title}</h4>
                            <span class="priority-badge">${rec.priority}</span>
                        </div>
                        
                        <div class="rec-content">
                            <p>${rec.description}</p>
                            
                            ${rec.timeline ? `
                                <div class="timeline">
                                    <i class="fas fa-clock"></i>
                                    <span>${rec.timeline}</span>
                                </div>
                            ` : ''}
                            
                            ${rec.actionItems ? `
                                <ul class="action-items">
                                    ${rec.actionItems.map(item => `
                                        <li><i class="fas fa-check"></i>${item}</li>
                                    `).join('')}
                                </ul>
                            ` : ''}
                            
                            ${rec.guidelines ? `
                                <ul class="guidelines">
                                    ${rec.guidelines.map(guide => `
                                        <li><i class="fas fa-arrow-right"></i>${guide}</li>
                                    `).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            container.innerHTML = html;
        }
    });
}