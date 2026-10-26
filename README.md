# Web Development Quiz

A lightweight, browser-based quiz for testing knowledge of HTML, CSS, JavaScript, web standards, and accessibility.

The application is built with plain HTML, CSS, and JavaScript. 
## Features

- 19 questions covering:
  - HTML structure and forms
  - CSS layout and units
  - JavaScript fundamentals
  - HTTP and web accessibility
  - True/false web development statements
- Choose between 5, 10, or 15 questions.
- Questions are randomly selected for each quiz.
- A 15-second countdown timer for every question.
- Immediate visual feedback for correct and incorrect answers.
- Progress bar and question counter.
- Speed-based scoring: answering correctly sooner produces a higher score.
- Player name entry with an anonymous fallback.
- Local top-10 leaderboard stored in the browser's `localStorage`.
- Responsive layout for desktop and mobile screens.
- Accessibility-focused markup, including labels, button states, and a live timer region.

## Getting Started

### Requirements

Any modern web browser with JavaScript enabled.

### Run locally

1. Clone or download this project.
2. Open `index.html` in a web browser.
3. Click **Start Quiz**.
4. Enter a name, choose the number of questions, and click **Let's start**.



## How to Play

1. Start the quiz from the welcome screen.
2. Enter your name, or leave the field empty to play as `Anonymous`.
3. Select 5, 10, or 15 questions.
4. Choose one answer before the 15-second timer expires.
5. Review the feedback and continue with **Next**.
6. View your final score and leaderboard ranking when the quiz ends.

If the timer reaches zero, the correct answer is revealed and the quiz continues. A question can only be answered once.

## Scoring

Each correct answer earns points based on response time:

```text
points for a correct answer = 15 - time spent answering
```

The maximum possible score is 15 points per question. Incorrect answers and unanswered questions do not add points. Scores are displayed with two decimal places.

The leaderboard ranks entries by their score percentage rather than by raw score, allowing quizzes with different lengths to be compared:

```text
score percentage = score / (number of questions × 15)
```

Only the 10 highest-ranked entries are retained.

## Project Structure

```text
project1_quizz/
├── index.html    # Page structure and quiz screens
├── styles.css    # Layout, responsive styles, colors, and animations
├── script.js     # Questions, quiz state, timer, scoring, and leaderboard logic
└── README.md     # Project documentation
```

## Customizing the Quiz

To add or edit questions, update the `questions` array in [`script.js`](./script.js). Each question uses this structure:

```javascript
{
    question: "Your question here",
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: 0
}
```

The `answer` value is the zero-based index of the correct option.



