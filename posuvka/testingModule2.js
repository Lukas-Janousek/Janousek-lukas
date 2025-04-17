// testingModule.js
import { checkSliderPosition } from './script.js';


let currentQuestion = 0;
const questions = Array.from({ length: 5 }, () => {
    const steps = Math.floor((150 - 0.05) / 0.05); // Počet možných kroků
    const randomStep = Math.floor(Math.random() * steps); // Náhodný krok
    const value = 0.05 + randomStep * 0.05; // Výpočet hodnoty
    const roundedValue = Math.round(value * 100) / 100; // Jistota dvou desetinných míst
    return {
        expectedValue: roundedValue,
        questionText: `Nastav posuvné měřidlo na ${roundedValue.toFixed(2)} mm`
    };
});


/*   jenom desetiny!!!!!!!!!!!!!!!
let currentQuestion = 0;
const questions = Array.from({ length: 5 }, () => {
    const randomValue = Math.random() * 149.99 + 0.01; // Rozmezí od 0.01 do 150.00
    const roundedValue = Math.round(randomValue * 10) / 10; // Zaokrouhlení na 2 desetinná místa
    return {
        expectedValue: roundedValue,
        questionText: `Nastav šupléru na ${roundedValue.toFixed(2)} mm`
    };
});
*/
// Initialize the testing process
function startTesting() {
    displayQuestion();
}

// Display question and expected value
function displayQuestion() {
    const question = questions[currentQuestion];
    document.getElementById("question").textContent = question.questionText;
}

// Check if the user has set the slider correctly
document.getElementById("checkButton").addEventListener("click", () => {
    const question = questions[currentQuestion];

    // Use the function to check the slider position
    const isCorrect = checkSliderPosition(question.expectedValue);

    if (isCorrect) {
        alert("✅SPRÁVNĚ, DOBRÁ PRÁCE.✅");
    } else {
        alert("❌ŠPATNĚ, ZKUS TO ZNOVU.❌");
    }

    // Move to the next question
    currentQuestion = (currentQuestion + 1) % questions.length;
    displayQuestion();
});

// Start testing when the page is ready
startTesting();