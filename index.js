const words = [
  "apple",
  "mummy",
  "silly",
  "happy",
  "shape",
  "mimes",
  "pride",
  "flame",
  "table",
  "grape",
  "pizza",
  "fuzed",
];

// choose random word from the list.
const gameState = {
  correctWord: words[Math.floor(Math.random() * words.length)],
  numAttempt: 0,
};

function createBoard() {
  const board = document.getElementById("game-board");

  const rows = Array.from({ length: 6 });
  rows.forEach((_, i) => {
    const cols = Array.from({ length: 5 });
    cols.forEach((_, j) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", `cell-${i}-${j}`);
      board.appendChild(cell);
    });
  });
}

createBoard();

document.getElementById("submit-guess").addEventListener("click", function () {
  const userGuess = document.getElementById("guess").value.toLowerCase();

  if (userGuess.length != 5) {
    alert("Please enter a 5 letter word.");
    return;
  }

  checkGuess(userGuess);

  const inputField = document.getElementById("guess");
  inputField.focus();
  inputField.select();
});

function checkGuess(guess) {
  if (gameState.numAttempt >= 6) {
    alert(
      "Sorry, you did not win this time. The answer was " +
        gameState.correctWord
    );
    endGame();
    return;
  }

  let remainingLetters = gameState.correctWord.split("");
  let guessLetterStatus = new Array(5).fill(false);

  // create green space on correct index
  for (let i = 0; i < 5; i++) {
    const cell = document.getElementById(`cell-${gameState.numAttempt}-${i}`);
    cell.textContent = guess[i];

    if (guess[i] === gameState.correctWord[i]) {
      cell.classList.add("correct");
      remainingLetters[i] = "";
      guessLetterStatus[i] = true;
    }
  }

  // check the correct letter in different index
  for (let i = 0; i < 5; i++) {
    if (guessLetterStatus[i]) continue;

    const cell = document.getElementById(`cell-${gameState.numAttempt}-${i}`);
    const indexInRemaining = remainingLetters.indexOf(guess[i]);

    if (indexInRemaining !== -1) {
      cell.classList.add("wrong-position");
      remainingLetters[indexInRemaining] = "";
    } else {
      cell.classList.add("incorrect");
    }
  }

  gameState.numAttempt++;

  // check if the guess was correct
  if (guess === gameState.correctWord) {
    alert("Yay! You win!");
    endGame();
  }
}

const endGame = () => {
  document.getElementById("submit-guess").disabled = true;
  document.getElementById("new-game").style.display = "block";
};

document.getElementById("new-game").addEventListener("click", function () {
  document.getElementById("game-board").innerHTML = "";
  gameState.correctWord = words[Math.floor(Math.random() * words.length)];
  gameState.numAttempt = 0;
  createBoard();
  document.getElementById("guess").value = "";
  document.getElementById("submit-guess").disabled = false;
  document.getElementById("new-game").style.display = "none";
});
