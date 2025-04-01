function nextStep(step) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
    speakText("Proceeding to the next step.");
}

function selectGender(gender) {
    speakText("You have selected " + gender);
    nextStep(3); // Placeholder for next step
}

function speakText(text) {
    responsiveVoice.speak(text, "UK English Male", {rate: 1.0});
}