import type { EditorLanguageKey } from "@/types/editor";

interface MockFile {
  name: string;
  language: EditorLanguageKey;
  content: string;
}

export const MOCK_FILES: { [key: string]: MockFile } = {
  "index.html": {
    name: "index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Guess the Number</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="game-container">
    <button id="toggle-theme">🌙 Night Mode</button>
    <h1>Guess the Number!</h1>
    <p>I'm thinking of a number between 1 and 100.</p>
    <input type="number" id="guess" placeholder="Enter your guess" />
    <button id="submit">Guess</button>
    <p id="message"></p>
  </div>

  <script src="script.js"></script>
</body>
</html>
s`,
  },
  "style.css": {
    name: "style.css",
    language: "css",
    content: `body {
  font-family: Arial, sans-serif;
  background: #f0f4f8;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  transition: background 0.3s;
}

.game-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: background 0.3s, color 0.3s;
}

input, button {
  padding: 0.5rem;
  margin: 1rem 0;
  width: 200px;
}

button {
  cursor: pointer;
}

/* Night Mode Styles */
body.dark {
  background: #121212;
}

body.dark .game-container {
  background: #1e1e1e;
  color: white;
}

body.dark input, 
body.dark button {
  background-color: #333;
  color: white;
  border: none;
}

#message {
  margin-top: 1rem;
  font-weight: bold;
}
`,
  },
  "script.js": {
    name: "script.js",
    language: "javascript",
    content: `const randomNumber = Math.floor(Math.random() * 100) + 1;
const submitBtn = document.getElementById("submit");
const guessInput = document.getElementById("guess");
const message = document.getElementById("message");
const toggleBtn = document.getElementById("toggle-theme");

submitBtn.addEventListener("click", () => {
  const guess = Number(guessInput.value);

  if (!guess || guess < 1 || guess > 100) {
    message.textContent = "Please enter a valid number between 1 and 100.";
    message.style.color = "orange";
    return;
  }

  if (guess === randomNumber) {
    message.textContent = "🎉 Correct! The number was " + randomNumber + ".";
    message.style.color = "green";
  } else if (guess < randomNumber) {
    message.textContent = "Too low! Try again.";
    message.style.color = "red";
  } else {
    message.textContent = "Too high! Try again.";
    message.style.color = "red";
  }

  guessInput.value = "";
});

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleBtn.textContent = "☀️ Light Mode";
  } else {
    toggleBtn.textContent = "🌙 Night Mode";
  }
});

`,
  },
};