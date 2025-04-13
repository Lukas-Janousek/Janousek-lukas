// testingModule.js
import {checkMicrometerPosition } from './micrometer.js';

let currentQuestion = 0;
const questions = Array.from({ length: 5 }, () => {
    const randomValue = Math.random() * 24.99 + 0.01; // Rozmezí od 0.01 do 25.00
    const roundedValue = Math.round(randomValue * 100) / 100; // Zaokrouhlení na 2 desetinná místa
    return {
        expectedValue: roundedValue,
        questionText: `Nastav mikrometr na  ${roundedValue.toFixed(2)}mm`
    };
});

// Initialize the testing process
function startTesting() {
    displayQuestion();
}

// Display question and expected value
function displayQuestion() {
    const question = questions[currentQuestion];
    document.getElementById("question").textContent = question.questionText;
}

// Check if the user has set the micrometer correctly
document.getElementById("checkButton").addEventListener("click", () => {
    const question = questions[currentQuestion];

    // Use the function to check the micrometer position
    const isCorrect = checkMicrometerPosition(question.expectedValue);

    if (isCorrect) {
        alert("✅SPRÁVNĚ, DOBRÁ PRÁCE.✅");
    } else {
        alert("❌ŠPATNĚ, ZKUS TO ZNOVU.❌ ");
    }

    // Move to the next question
    currentQuestion = (currentQuestion + 1) % questions.length;
    displayQuestion();
});

// Start testing when the page is ready
startTesting();
