const words = ["apple","mummy","silly","happy","shape","mimes","pride","flame",
  "table","grape","pizza","fuzed","laser","trend","cable","blink","water",
  "crisp","brave","tease","flock","climb","train","spike","smile","crowd",
  "grind","blaze","frost","light",
];

// choose random word from the list.
const gameState = {
  correctWord: words[Math.floor(Math.random() * words.length)],
  numAttempt: 0,
};

function createBoard() {
  const board = document.getElementById("game-board");

  //create 6 x 5 board
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
console.log("The answer is", gameState.correctWord);
createBoard();

document
  .getElementById("submit-guess")
  .addEventListener("click", async function () {
    const userGuess = document.getElementById("guess").value.toLowerCase();

    if (userGuess.length != 5) {
      alert("Please enter a 5 letters word.");
      const inputField = document.getElementById("guess");
      inputField.focus();
      inputField.select();
      return;
    }

    // only call checkGuess if user's input word exists
    const checkIfValid = await checkWordExisting(userGuess);

    if (checkIfValid) {
      checkGuess(userGuess);
      updateUsedLetters(userGuess, gameState.correctWord);
    } else {
      alert("No such word!");
    }

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

// check if function exist
async function checkWordExisting(word) {
  try {
    const res = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
    if (!res.ok) throw new Error(`Problem with api ${res.status}`);

    const data = await res.json();

    // check if it is valid word
    if (data[0] == undefined) {
      return false;
    } else if (data[0].word == word) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    alert(err.message);
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
  console.log("The answer is", gameState.correctWord);
  resetUsedLetters();
});

const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p",
  "q","r","s","t","u","v","w","x","y","z"];

function displayUsedLetter() {
  const letterGrid = document.getElementById("display-used-letter");
  alphabet.forEach(letter => {
    const letterDiv = document.createElement("div");
    letterDiv.classList.add("letter");
    letterDiv.setAttribute("id", `letter-${letter}`);
    letterDiv.textContent = letter.toUpperCase();
    letterGrid.appendChild(letterDiv);
  });
}

displayUsedLetter();

function updateUsedLetters(guess, correctWord) {
  guess.split('').forEach((letter, index) => {
    const letterDiv = document.getElementById(`letter-${letter}`);

      if (correctWord[index] === letter) {
        letterDiv.classList.remove("wrong-position", "incorrect");
        letterDiv.classList.add("correct");
      } else if(correctWord.includes(letter) && !letterDiv.classList.contains("correct")){
        letterDiv.classList.remove("incorrect");
        letterDiv.classList.add("wrong-position");
      } else if (!correctWord.includes(letter)){
      letterDiv.classList.add("incorrect");
      }
  })
}

// reset used letter boards
const resetUsedLetters = () => {
  alphabet.forEach(letter => {
    const letterDiv = document.getElementById(`letter-${letter}`);
    letterDiv.classList.remove("correct", "wrong-position", "incorrect");
  })
}