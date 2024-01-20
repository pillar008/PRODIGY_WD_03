const playerX = "X";
const playerO = "O";
let currentPlayer = playerX;
let isHumanVsHuman = true;
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let gameStarted = false;

let userChoice = ""; // Variable to store user's choice

function resetGame() {
  gameStarted = false;
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = userChoice; // Preserve user's choice
  gameOver = false;
  updateGameButton("Start Game");
  updateGameBoard();
  updateMessage("");
}

function startGame() {
  gameStarted = true;
  userChoice = prompt("Do you want to play as X or O?").toUpperCase();

  if (userChoice !== "X" && userChoice !== "O") {
    // If the user enters an invalid choice, default to 'X'
    userChoice = "X";
  }

  currentPlayer = userChoice;
  updateGameButton("Restart");
  resetGameBoard();
}

function updateGameButton(text) {
  const gameButton = document.getElementById("gameButton");
  gameButton.textContent = text;
}

function updateGameBoard() {
  const gameBoardElement = document.getElementById("gameBoard");
  gameBoardElement.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);

    if (gameBoard[i] !== "") {
      cell.textContent = gameBoard[i];
      cell.classList.add(gameBoard[i]); // Add X or O class
    }

    gameBoardElement.appendChild(cell);
  }
}

function handleButtonClick() {
  if (!gameStarted) {
    showGameModeModal();
  } else {
    resetGame();
  }
}

function handleCellClick(event) {
  if (gameOver) return;

  const index = event.target.dataset.index;

  if (gameBoard[index] === "") {
    gameBoard[index] = currentPlayer;
    updateGameBoard();

    if (checkWin() || checkTie()) {
      gameOver = true;
      updateMessage(gameOver ? `Player ${currentPlayer} wins!` : "It's a tie!");
      updateGameButton("Restart");
    } else {
      currentPlayer = currentPlayer === playerX ? playerO : playerX;

      if (!isHumanVsHuman && currentPlayer === playerO) {
        setTimeout(makeAiMove, 500);
      }
    }
  }
}

function makeAiMove() {
  if (!gameOver) {
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
      if (cell === "") {
        acc.push(index);
      }
      return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const aiMove = emptyCells[randomIndex];

    gameBoard[aiMove] = currentPlayer;
    updateGameBoard();

    if (checkWin() || checkTie()) {
      gameOver = true;
      updateMessage(gameOver ? `Player ${currentPlayer} wins!` : "It's a tie!");
      updateGameButton("Restart");
    } else {
      currentPlayer = currentPlayer === playerX ? playerO : playerX;
    }
  }
}

function checkWin() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      gameBoard[a] !== "" &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      return true;
    }
  }

  return false;
}

function checkTie() {
  return !gameBoard.includes("") && !checkWin();
}

function updateMessage(message) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;

  if (message === "It's a tie!") {
    setTimeout(() => {
      resetGame();
      updateGameBoard();
    }, 2000);
  }
}

function resetGameBoard() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = userChoice; // Preserve user's choice
  gameOver = false;
  updateGameButton("Start Game");
  updateGameBoard();
  updateMessage("");
}

function showGameModeModal() {
  const modal = document.getElementById("gameModeModal");
  modal.style.display = "block";
}

function closeGameModeModal() {
  const modal = document.getElementById("gameModeModal");
  modal.style.display = "none";
}

function startGameMode(mode) {
  isHumanVsHuman = mode === "human";
  closeGameModeModal();
  startGame();
}

// Initialize the game
resetGame();
