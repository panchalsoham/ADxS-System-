let model;
let currentImage = null;
let rotation = 0;
let scale = 1;

// Load TensorFlow model
async function loadModel() {
    try {
        model = await tf.loadLayersModel('model/brain_tumor_model.json');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadModel();
    setupImageUpload();
});

function setupImageUpload() {
    const uploadBox = document.getElementById('uploadBox');
    const imageInput = document.getElementById('imageInput');

    uploadBox.addEventListener('click', () => imageInput.click());
    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('drop', handleDrop);

    imageInput.addEventListener('change', handleImageSelect);
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImage(files[0]);
    }
}

function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
}

async function handleImage(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = new Image();
        currentImage.src = e.target.result;
        currentImage.onload = () => {
            showPreview();
            startAnalysis();
        };
    };
    reader.readAsDataURL(file);
}

function showPreview() {
    document.getElementById('uploadBox').style.display = 'none';
    document.getElementById('previewBox').style.display = 'block';
    document.getElementById('previewImage').src = currentImage.src;
}

async function startAnalysis() {
    const analysisSection = document.getElementById('analysisSection');
    analysisSection.style.display = 'block';
    
    // Simulate analysis steps
    await updateProgress(0, 'Processing image...');
    await preprocessImage();
    
    await updateProgress(33, 'Running AI analysis...');
    const results = await runDiagnosis();
    
    await updateProgress(66, 'Generating results...');
    await generateHeatmap();
    
    await updateProgress(100, 'Complete');
    showResults(results);
}

async function updateProgress(progress, message) {
    const progressBar = document.getElementById('analysisProgress');
    progressBar.style.width = `${progress}%`;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
}

async function preprocessImage() {
    // Image preprocessing logic here
    const tensor = tf.browser.fromPixels(currentImage)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();
    return tensor;
}

async function runDiagnosis() {
    try {
        const tensor = await preprocessImage();
        const predictions = await model.predict(tensor).data();
        
        return {
            hasTumor: predictions[0] > 0.5,
            confidence: predictions[0] * 100
        };
    } catch (error) {
        console.error('Diagnosis error:', error);
        return { hasTumor: false, confidence: 0 };
    }
}

async function generateHeatmap() {
    // Heatmap generation logic would go here
    // For demo, we'll use a placeholder
    const heatmapImage = document.getElementById('heatmapImage');
    // Set placeholder heatmap
}

function showResults(results) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';

    // Update detection indicator
    const indicator = document.querySelector('.indicator-circle');
    indicator.className = 'indicator-circle ' + (results.hasTumor ? 'positive' : 'negative');
    document.getElementById('detectionResult').textContent = 
        results.hasTumor ? 'Tumor Detected' : 'No Tumor Detected';

    // Update confidence meter
    const confidenceMeter = document.getElementById('confidenceMeter');
    const confidenceScore = document.getElementById('confidenceScore');
    confidenceMeter.style.width = `${results.confidence}%`;
    confidenceScore.textContent = `${Math.round(results.confidence)}%`;
}

// Image manipulation functions
function rotateImage() {
    rotation += 90;
    const preview = document.getElementById('previewImage');
    preview.style.transform = `rotate(${rotation}deg) scale(${scale})`;
}

function zoomImage(factor) {
    scale *= factor;
    const preview = document.getElementById('previewImage');
    preview.style.transform = `rotate(${rotation}deg) scale(${scale})`;
}

function resetImage() {
    rotation = 0;
    scale = 1;
    const preview = document.getElementById('previewImage');
    preview.style.transform = '';
}

function downloadReport() {
    // Generate and download PDF report
    alert('Downloading report...');
}

function startNewDiagnosis() {
    location.reload();
}
