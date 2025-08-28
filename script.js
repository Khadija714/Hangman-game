class Player {
  constructor(name) {
    this.name = name;
    this.guessed = new Set();
  }
  hasGuessed(letter) {
    return this.guessed.has(letter);
  }
  addGuess(letter) {
    this.guessed.add(letter);
  }
}

class Word {
  constructor(secret) {
    this.secret = secret.toUpperCase();
    this.revealed = Array(secret.length).fill("_");
  }
  checkAndReveal(letter) {
    let found = false;
    this.secret.split("").forEach((ch, i) => {
      if (ch === letter) {
        this.revealed[i] = letter;
        found = true;
      }
    });
    return found;
  }
  display() {
    return this.revealed.join(" ");
  }
  isGuessed() {
    return !this.revealed.includes("_");
  }
}

class HangmanDrawing {
  constructor() {
    this.parts = [
      document.getElementById("head"),
      document.getElementById("body"),
      document.getElementById("leg"),
    ];
  }
  showPart(wrong) {
    if (wrong > 0 && wrong <= this.parts.length) {
      this.parts[wrong - 1].classList.remove("hidden");
    }
  }
  reset() {
    this.parts.forEach(p => p.classList.add("hidden"));
  }
}

class HangmanGame {
  constructor() {
    this.words = ["APPLE", "BANANA", "COMPUTER", "PYTHON", "GUITAR", "PAKISTAN", "JAVASCRIPT", "DEVELOPER", "HANGMAN", "WRONGGUESS", "CONGRATULATIONS", "DOG", "CAT", "LION", "WOLF", "HTML", "CSS", "WITNESS", "PATIENCE", "INDIA", "CHINA", "JAPAN", "CANADA", "BRAZIL", "FRANCE", "GERMANY", "STRAWBERRY", "CHERRY", "WATERMELON", "KIWI", "GUAVA", "APRICOT", "COCONUT", "EGYPT", "TURKEY", "ITALY", "SPAIN", "RUSSIA", "MEXICO", "ENGLAND", "RED", "BLUE", "GREEN", "YELLOW", "PURPLE", "BLACK", "WHITE", "PINK", "BROWN", "ORANGE", "VIOLET", "GREY", "INDIGO", "CRICKET", "FOOTBALL", "HOCKEY", "TENNIS", "BADMINTON", "BASKETBALL", "RUGBY", "VOLLEYBALL", "SWIMMING", "BOXING", "ATHLETICS", "BASEBALL", "MOBILE", "KEYBOARD", "PRINTER", "BOTTLE", "CANDLE",
  "WINDOW", "TABLE", "CHAIR", "NOTEBOOK", "MARKER", "BAG", "CUPBOARD", "LAMP", "MANGO", "ORANGE", "GRAPES", "PINEAPPLE", "PAPAYA", "PEACH"];
    this.maxTries = 3;
    this.tries = this.maxTries;
    this.player = null;
    this.word = null;
    this.drawing = new HangmanDrawing();
    this.keyboardDiv = document.getElementById("keyboard");
    this.statusDiv = document.getElementById("status");
    this.wordDiv = document.getElementById("word");
  }

  start(name) {
    document.getElementById("player-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    document.getElementById("result-screen").classList.add("hidden");

    this.player = new Player(name);
    this.word = new Word(this.words[Math.floor(Math.random() * this.words.length)]);
    this.tries = this.maxTries;
    this.drawing.reset();
    this.updateUI();
    this.renderKeyboard();
  }

  handleGuess(letter, btn) {
    if (this.player.hasGuessed(letter)) return;
    this.player.addGuess(letter);
    btn.disabled = true;

    if (this.word.checkAndReveal(letter)) {
      btn.style.background = "#a5d6a7";
    } else {
      this.tries--;
      this.drawing.showPart(this.maxTries - this.tries);
      btn.style.background = "#ef9a9a";
    }
    this.updateUI();
  }

  updateUI() {
    this.wordDiv.textContent = this.word.display();
    this.statusDiv.textContent = `Tries left: ${this.tries}`;

    if (this.word.isGuessed()) {
      this.endGame(`${this.player.name}, Congratulations You Win!`);
    } else if (this.tries === 0) {
      this.endGame(`Game Over! The word was ${this.word.secret}`);
    }
  }

  renderKeyboard() {
    this.keyboardDiv.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
      let letter = String.fromCharCode(i);
      let btn = document.createElement("button");
      btn.textContent = letter;
      btn.onclick = () => this.handleGuess(letter, btn);
      this.keyboardDiv.appendChild(btn);
    }
  }

  endGame(message) {
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");
    document.getElementById("result-message").textContent = message;
  }
}

const game = new HangmanGame();

document.getElementById("startBtn").addEventListener("click", () => {
  const name = document.getElementById("playerName").value || "Player";
  game.start(name);
});

document.getElementById("yesBtn").addEventListener("click", () => {
  game.start(game.player.name);
});

document.getElementById("noBtn").addEventListener("click", () => {
  document.getElementById("result-message").textContent = "Thank you for playing!";
  document.querySelector(".btn-group").style.display = "none";
});
