let currentQuestionIndex = 0;
let score = 0;
let quizData = []; // Declare quizData as a global variable
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

console.log("Script loaded");

async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const data = await response.json();
    return data.results.map(item => {
        // Create an array of answers including the correct answer
        const answers = [...item.incorrect_answers, item.correct_answer];
        // Shuffle the answers
        const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
        // Find the index of the correct answer in the shuffled array
        const correctIndex = shuffledAnswers.indexOf(item.correct_answer);
        return {
            question: item.question,
            answers: shuffledAnswers,
            correct: correctIndex // Set the correct index based on the shuffled array
        };
    });
}

async function loadQuestions() {
    quizData = await fetchQuestions(); // Assign fetched questions to the global quizData variable
    loadQuestion();
}

function loadQuestion() {
    nextBtn.disabled = true;
    questionEl.innerHTML = `Question ${currentQuestionIndex + 1}: ${quizData[currentQuestionIndex].question}`;
    answersEl.innerHTML = "";
    quizData[currentQuestionIndex].answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerHTML = answer;
        button.onclick = () => checkAnswer(index, button);
        answersEl.appendChild(button);
    });
}

function checkAnswer(index, button) {
    const correctIndex = quizData[currentQuestionIndex].correct;

    const buttons = answersEl.querySelectorAll("button");
    buttons.forEach(btn => {
        btn.disabled = true; // Disable all buttons
    });

    if (index === correctIndex) {
        score++;
        button.classList.add("correct");
        button.style.backgroundColor = "#4CAF50"; // Green for correct answer
    } else {
        button.classList.add("incorrect");
        button.style.backgroundColor = "#f44336"; // Red for incorrect answer
        const correctButton = answersEl.children[correctIndex];
        correctButton.classList.add("correct");
        correctButton.style.backgroundColor = "#4CAF50"; // Green for correct answer
    }

    scoreEl.textContent = score;
    nextBtn.disabled = false; // Enable the next button
    console.log(`Selected index: ${index}, Correct index: ${correctIndex}`);
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < 10) { // Ensure only 10 questions are asked
        loadQuestion();
    } else {
        questionEl.textContent = "Quiz Over! Your final score is: " + score;
        answersEl.innerHTML = "";
        nextBtn.style.display = "none";
        restartBtn.style.display = "block"; // Show restart button
    }
});

restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreEl.textContent = score;
    nextBtn.style.display = "block";
    restartBtn.style.display = "none"; // Hide restart button
    loadQuestions(); // Reload questions
});

// Start the quiz by fetching questions
loadQuestions(); 