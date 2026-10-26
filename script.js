// Données du Quiz
const questions = [
    // --- HTML & Structure ---
    {
        question: "What is the correct HTML5 tag to define the main navigation of a site?",
        options: ["<nav>", "<navigation>", "<header>", "<menu>"],
        answer: 0
    },
    {
        question: "Which HTML attribute makes a form field mandatory?",
        options: ["validate", "important", "required", "mandatory"],
        answer: 2
    },
    {
        question: "Which tag is used to embed an image in an HTML page?",
        options: ["<picture>", "<img>", "<src>", "<media>"],
        answer: 1
    },

    // --- CSS & Layout ---
    {
        question: "In CSS, which 'position' value fixes an element relative to the browser viewport?",
        options: ["absolute", "relative", "fixed", "sticky"],
        answer: 2
    },
    {
        question: "Which CSS property is used to modify the space INSIDE a border?",
        options: ["margin", "padding", "border-spacing", "gap"],
        answer: 1
    },
    {
        question: "In CSS Grid, which property defines the number and size of columns?",
        options: ["grid-columns", "grid-template-columns", "flex-direction", "grid-auto-flow"],
        answer: 1
    },
    {
        question: "Which CSS unit is relative to the font size of the root element (<html>)?",
        options: ["em", "px", "rem", "%"],
        answer: 2
    },

    // --- JavaScript & Logic ---
    {
        question: "Which JavaScript method removes the last element from an array?",
        options: ["shift()", "pop()", "push()", "slice()"],
        answer: 1
    },
    {
        question: "What does the expression 'typeof []' return in JavaScript?",
        options: ["array", "object", "null", "undefined"],
        answer: 1
    },
    {
        question: "Which event listener is triggered when a user clicks on an element?",
        options: ["onhover", "onchange", "click", "submit"],
        answer: 2
    },
    {
        question: "Which function converts a JSON string into a JavaScript object?",
        options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "String.toJSON()"],
        answer: 1
    },
    {
        question: "Which operator compares both value AND type in JavaScript?",
        options: ["==", "=", "===", "!="],
        answer: 2
    },

    // --- Web & Accessibility ---
    {
        question: "What does the acronym ARIA stand for in web accessibility?",
        options: [
            "Accessible Rich Internet Applications",
            "Advanced Responsive Interface Architecture",
            "Automated Reader Integration Association",
            "Application Resource for Internet Access"
        ],
        answer: 0
    },
    {
        question: "Which HTTP status code indicates that the requested resource could not be found?",
        options: ["200", "500", "404", "403"],
        answer: 2
    },
    {
        question: "Which attribute of an <img> tag is essential for screen readers (accessibility)?",
        options: ["title", "alt", "description", "label"],
        answer: 1
    },

    // --- True / False Questions ---
    {
        question: "HTML stands for HyperText Markup Language.",
        options: ["True", "False"],
        answer: 0
    },
    {
        question: "In CSS, classes are denoted with a dot (.) prefix.",
        options: ["True", "False"],
        answer: 0
    },
    {
        question: "JavaScript is a strictly statically typed programming language.",
        options: ["True", "False"],
        answer: 1
    },
    {
        question: "The 'alt' attribute on an <img> tag is optional and has no impact on screen readers.",
        options: ["True", "False"],
        answer: 1
    }
];

// Variables d'état étendues
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;
let selectedQuestionCount = 5;
let activeQuestions = [];
const QUESTION_TIME_LIMIT = 15;
const LEADERBOARD_STORAGE_KEY = 'quiz-highscores';
const MAX_LEADERBOARD_ENTRIES = 10;
let remainingTime = QUESTION_TIME_LIMIT;
let timerInterval;
let questionStartedAt = 0;
let resultsTimeout;
let playerName = '';

// Éléments du DOM
const homeScreen = document.getElementById('home-screen');
const configScreen = document.getElementById('config-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const launchQuizBtn = document.getElementById('launch-quiz-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const playerNameInput = document.getElementById('player-name');

const configBtns = document.querySelectorAll('.config-btn');
const questionCounter = document.getElementById('question-counter');
const timer = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const finalScoreEl = document.getElementById('final-score');
const totalQuestionsEl = document.getElementById('total-questions');
const resultMessageEl = document.getElementById('result-message');
const leaderboardList = document.getElementById('leaderboard-list');

// Écouteurs d'événements
startBtn.addEventListener('click', () => {
    homeScreen.classList.remove('active');
    configScreen.classList.add('active');
});

// Gestion de la sélection du nombre de questions
configBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        configBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const count = btn.getAttribute('data-count');
        selectedQuestionCount = count === 'all' ? questions.length : parseInt(count, 10);
    });
});

launchQuizBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', handleNextQuestion);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
    clearInterval(timerInterval);
    clearTimeout(resultsTimeout);
    configScreen.classList.remove('active');
    quizScreen.classList.add('active');
    currentQuestionIndex = 0;
    score = 0;
    playerName = playerNameInput.value.trim() || 'Anonymous';

    const limit = Math.min(selectedQuestionCount, questions.length);
    
    activeQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, limit);
    
    totalQuestionsEl.textContent = activeQuestions.length;
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);
    answerSelected = false;
    nextBtn.classList.add('hidden');
    remainingTime = QUESTION_TIME_LIMIT;
    questionStartedAt = Date.now();
    
    const currentQ = activeQuestions[currentQuestionIndex];
    
    // Mise à jour de l'en-tête
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${activeQuestions.length}`;
    updateTimer();
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimer();

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            selectAnswer(null);
        }
    }, 1000);
    const progressPercent = (currentQuestionIndex / activeQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Affichage de la question
    questionText.textContent = currentQ.question;
    
    // Génération des options de réponse
    optionsContainer.innerHTML = '';
    currentQ.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option;
        button.setAttribute('aria-label', option);
        button.addEventListener('click', () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex, selectedButton) {
    if (answerSelected) return;
    answerSelected = true;
    clearInterval(timerInterval);

    const currentQ = activeQuestions[currentQuestionIndex];
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');

    optionButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === currentQ.answer) {
        selectedButton.classList.add('correct');
        const timeSpent = (Date.now() - questionStartedAt) / 1000;
        score += QUESTION_TIME_LIMIT - (timeSpent);
    } else if (selectedIndex === null) {
        optionButtons[currentQ.answer].classList.add('correct');
        timer.textContent = "Time's up!";
    } else {
        selectedButton.classList.add('incorrect');
        optionButtons[currentQ.answer].classList.add('correct');
    }

    const progressPercent = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    if (currentQuestionIndex < activeQuestions.length - 1) {
        nextBtn.classList.remove('hidden');
    } else {
        resultsTimeout = setTimeout(showResults, 1000);
    }
}

function handleNextQuestion() {
    clearInterval(timerInterval);
    currentQuestionIndex++;
    loadQuestion();
}

function showResults() {
    clearInterval(timerInterval);
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    finalScoreEl.textContent = score.toFixed(2);
    totalQuestionsEl.textContent = activeQuestions.length * QUESTION_TIME_LIMIT;
    saveHighScore();
    renderLeaderboard();

    const percentage = (score / activeQuestions.length) * 100;
    if (percentage === 100) {
    resultMessageEl.textContent = "Perfect score";
} else if (percentage >= 60) {
    resultMessageEl.textContent = "Well done! You've mastered the topic";
} else {
    resultMessageEl.textContent = "Not bad, but you can do better";
}

function getLeaderboard() {
    const storedScores = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!storedScores) return [];

    try {
        const parsedScores = JSON.parse(storedScores);
        return Array.isArray(parsedScores) ? parsedScores : [];
    } catch (error) {
        console.warn('Unable to read saved high scores.', error);
        return [];
    }
}

function saveHighScore() {
    const leaderboard = [...getLeaderboard(), {
        name: playerName,
        score: Number(score.toFixed(2)),
        total: activeQuestions.length * QUESTION_TIME_LIMIT
    }]
        .sort((first, second) => (second.score / second.total) - (first.score / first.total))
        .slice(0, MAX_LEADERBOARD_ENTRIES);

    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
}

function renderLeaderboard() {
    leaderboardList.innerHTML = '';
    const leaderboard = getLeaderboard();

    if (leaderboard.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No scores yet';
        leaderboardList.appendChild(emptyMessage);
        return;
    }

    leaderboard.forEach(entry => {
        const listItem = document.createElement('li');
        const name = document.createElement('span');
        const points = document.createElement('strong');

        name.textContent = entry.name;
        points.textContent = `${entry.score.toFixed(2)} / ${entry.total}`;
        listItem.append(name, points);
        leaderboardList.appendChild(listItem);
    });
}
}

function restartQuiz() {
    clearInterval(timerInterval);
    clearTimeout(resultsTimeout);
    resultScreen.classList.remove('active');
    homeScreen.classList.add('active');
}

function updateTimer() {
    timer.textContent = `Time: ${remainingTime}s`;
    timer.classList.toggle('warning', remainingTime <= 5);
}