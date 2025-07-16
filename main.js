let currentRow = 10;
const allowduplicates = document.getElementById("duplicates");
let currentrowbuttons = null;
let clickedButtons = [];
let allowduplicatescheck = false;
let gameAttempts = 0; // Add game attempts counter

allowduplicates.addEventListener("change", () => {
  allowduplicatescheck = allowduplicates.checked;
});

// Generate Guess Boxes

const guessContainer = document.getElementById("guess");

for (let i = 0; i < 10; i++) {
  const row = document.createElement("div");
  row.className = `guess-row guess-row-${i}`;

  for (let j = 0; j < 4; j++) {
    const box = document.createElement("div");

    box.className = `guess-box guess-box-${j}`;

    row.appendChild(box);
  }

  guessContainer.appendChild(row);
}

// Generate Overlay Over Guess Boxes

for (let i = 0; i < 10; i++) {
  const row = document.querySelectorAll(".guess-row");

  if (row) {
    const overlay = document.createElement("div");
    overlay.id = `overlay-${i}`;
    overlay.style.position = "absolute";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "10";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
    row[i].appendChild(overlay);
  }
}

// Generate Result Boxes

const resultContainer = document.getElementById("result");

for (let i = 0; i < 10; i++) {
  const row = document.createElement("div");
  row.className = `result-row result-row-${i}`;

  for (let j = 0; j < 4; j++) {
    const box = document.createElement("div");
    box.className = "result-box";

    row.appendChild(box);
  }

  resultContainer.appendChild(row);
}

// Changing Cursor and Keep Track of Current Color

let currentcolor = "";

const colorButtons = document.querySelectorAll(".color");
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentcolor = button.classList[1];
    document.body.style.cursor = `url("Images/curser-${currentcolor}.png")20 20, auto`;
  });
});

// Show modern notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.4s ease-out";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 400);
  }, 4000);
}

// Change Color of Guess Boxes

function currentRowColours() {
  currentrowbuttons = document.querySelectorAll(
    `.guess-row-${currentRow - 1} .guess-box`
  );

  clickedButtons = [];

  currentrowbuttons.forEach((button) => {
    button.addEventListener("click", () => {
      clickedButtons.push(button);
      const hasDuplicateColor = clickedButtons.some(
        (b) => b.style.backgroundColor === currentcolor
      );
      if (currentcolor === "") {
        showNotification("Please select a color first!", "warning");
      } else {
        if (hasDuplicateColor && !allowduplicatescheck) {
          showNotification("No duplicates allowed!", "error");
        } else {
          button.style.backgroundColor = currentcolor;
          if (!allowduplicatescheck) {
            document.body.style.cursor = "auto";
            currentcolor = "";
          }
        }
      }
    });
  });
}

currentRowColours();

// Generate Secret Code

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "black",
  "white",
];

function generateSecretCode(withoutDuplicates) {
  let secretCode = [];

  if (withoutDuplicates) {
    let shuffledColors = [...colors];
    for (let i = shuffledColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledColors[i], shuffledColors[j]] = [
        shuffledColors[j],
        shuffledColors[i],
      ];
    }
    secretCode = shuffledColors.slice(0, 4);
  } else {
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      secretCode.push(colors[randomIndex]);
    }
  }

  return secretCode;
}

// Create confetti animation
function createConfetti() {
  const confettiContainer = document.getElementById('confetti');
  const colors = ['#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confettiContainer.appendChild(confetti);
  }
}

// Show win celebration with star rating
function showWinCelebration(attempts) {
  const winCelebration = document.getElementById('win-celebration');
  const starRating = document.getElementById('star-rating');
  const attemptsText = document.getElementById('attempts-text');
  
  // Calculate stars based on attempts
  let stars = 1;
  if (attempts <= 3) stars = 3;
  else if (attempts <= 6) stars = 2;
  
  // Create stars
  starRating.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const star = document.createElement('span');
    star.textContent = '⭐';
    star.style.color = i < stars ? '#fbbf24' : '#6b7280';
    starRating.appendChild(star);
  }
  
  attemptsText.textContent = `You solved it in ${attempts} attempts!`;
  
  // Show celebration
  winCelebration.classList.remove('hidden');
  createConfetti();
  
  // Setup celebration buttons
  document.getElementById('play-again').addEventListener('click', () => {
    location.reload();
  });
  
  document.getElementById('share-score').addEventListener('click', () => {
    const text = `I solved Mastermind in ${attempts} attempts! ${stars}⭐`;
    if (navigator.share) {
      navigator.share({
        title: 'Mastermind Game',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
      showNotification('Score copied to clipboard!', 'success');
    }
  });
}

// Show lose message
function showLoseMessage() {
  const loseMessage = document.getElementById('lose-message');
  loseMessage.classList.remove('hidden');
  
  document.getElementById('try-again').addEventListener('click', () => {
    location.reload();
  });
}

// Game Logic

const startButton = document.getElementById("start-game");

startButton.addEventListener("click", function (event) {
  const overlay = document.getElementById("overlay-9");
  if (overlay) {
    overlay.style.zIndex = "-1";
  }
  document.body.style.overflowX = "hidden";
  document.body.style.overflowY = "scroll";
  secretCode = generateSecretCode(!allowduplicatescheck);
  console.log(secretCode);
  const gameMenu = document.getElementById("game-menu-1");
  gameMenu.style.transition = "transform 0.5s ease-in-out";
  gameMenu.style.transform = "translateY(-110%)";
});

const checkButton = document.getElementById("check-guess");

checkButton.addEventListener("click", () => {
  const guessRow = document.querySelectorAll(
    `.guess-row-${currentRow - 1} .guess-box`
  );
  if (
    guessRow[0].style.backgroundColor === "" ||
    guessRow[1].style.backgroundColor === "" ||
    guessRow[2].style.backgroundColor === "" ||
    guessRow[3].style.backgroundColor === ""
  ) {
    console.log(guessRow[0]);
    showNotification("Please fill all the boxes before checking your guess", "warning");
    return;
  } else {
    gameAttempts++; // Increment attempts counter
    
    const guess = [];
    guessRow.forEach((box) => {
      guess.push(box.style.backgroundColor);
    });

    const resultRow = document.querySelectorAll(
      `.result-row-${currentRow - 1} .result-box`
    );
    const result = checkGuess(guess, secretCode);
    resultRow.forEach((box, index) => {
      box.style.backgroundColor = result[index];
    });

    if (result.every((color) => color === "red")) {
      // Win condition - show celebration instead of alert
      setTimeout(() => {
        showWinCelebration(gameAttempts);
      }, 500);
      
      checkButton.disabled = true;
      checkButton.style.backgroundColor = "grey";
      checkButton.style.cursor = "auto";
      checkButton.innerHTML = "You Won!";

      document.body.style.cursor = "auto";
      const actualcode = document.getElementById("code");
      const divs = actualcode.querySelectorAll("div");

      divs.forEach((div, index) => {
        div.innerHTML = "";

        if (index < secretCode.length) {
          div.style.backgroundColor = secretCode[index];
          div.style.width = "36px";
          div.style.height = "36px";
        }
        const overlay = document.getElementById(`overlay-${currentRow - 1}`);
        if (overlay) {
          overlay.style.zIndex = "10";
        }
      });
    } else {
      currentRow--;
      currentRowColours();

      if (currentRow - 1 < 0) {
        // Lose condition - show lose message instead of alert
        setTimeout(() => {
          showLoseMessage();
        }, 500);
        
        checkButton.disabled = true;
        checkButton.style.backgroundColor = "grey";
        checkButton.style.cursor = "auto";
        checkButton.innerHTML = "You Lost!";
        document.body.style.cursor = "auto";
        const actualcode = document.getElementById("code");
        const divs = actualcode.querySelectorAll("div");

        divs.forEach((div, index) => {
          div.innerHTML = "";

          if (index < secretCode.length) {
            div.style.backgroundColor = secretCode[index];
            div.style.border = "1px solid black";
            div.style.width = "36px";
            div.style.height = "36px";
          }
        });
      }

      const overlay = document.getElementById(`overlay-${currentRow - 1}`);
      if (overlay) {
        overlay.style.zIndex = "-1";
      }
      const previousOverlay = document.getElementById(`overlay-${currentRow}`);
      if (previousOverlay) {
        previousOverlay.style.zIndex = "10";
      }
    }
  }
});

function checkGuess(guess, secretCode) {
  const result = [];

  const unmatchedGuess = [];
  const unmatchedSecretCode = [];

  guess.forEach((color, index) => {
    if (color === secretCode[index]) {
      result.push("red");
    } else {
      unmatchedGuess.push(color);
      unmatchedSecretCode.push(secretCode[index]);
    }
  });

  unmatchedGuess.forEach((color) => {
    const index = unmatchedSecretCode.indexOf(color);
    if (index !== -1) {
      result.push("white");
      unmatchedSecretCode.splice(index, 1);
    } else {
      result.push("black");
    }
  });

  return result;
}

const checkingsomething = document.getElementById("check-guess");

const checkbox = document.getElementById("duplicates");

function saveCheckboxState() {
  localStorage.setItem("checkboxState", checkbox.checked);
}

function loadCheckboxState() {
  const savedState = localStorage.getItem("checkboxState");
  if (savedState !== null) {
    checkbox.checked = JSON.parse(savedState);
    allowduplicatescheck = checkbox.checked;
  }
}

checkbox.addEventListener("change", saveCheckboxState);

document.addEventListener("DOMContentLoaded", loadCheckboxState);

