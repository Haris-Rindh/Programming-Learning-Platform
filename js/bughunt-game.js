// CosmicCode Bug Hunting Arena Game Engine

const BUG_LEVELS = [
  {
    language: "javascript",
    title: "Level 1: Variable Declaring Core",
    code: [
      "// Let's declare our thruster power limit",
      "let thrustersActive = true;",
      "const maximumLimit = 500;",
      "let maximumLimit = 600; // Increase threshold",
      "console.log(maximumLimit);"
    ],
    bugLine: 3,
    explanation: "You declared a const variable 'maximumLimit' and then tried to re-declare it using 'let' on line 4, which triggers a syntax error in JavaScript.",
    correction: "maximumLimit = 600;"
  },
  {
    language: "python",
    title: "Level 2: Loop Block Indent",
    code: [
      "# Log sensor scanning pulse counts",
      "for i in range(3):",
      "print('Emitting sector pulse: ' + str(i))",
      "print('Scan cycle completed')"
    ],
    bugLine: 2,
    explanation: "Python uses indentation (4 spaces) to define code blocks inside a loop. The print statement on line 3 is missing indentation.",
    correction: "    print('Emitting sector pulse: ' + str(i))"
  },
  {
    language: "javascript",
    title: "Level 3: Mismatched Scope Brackets",
    code: [
      "function engageShield(shieldHealth) {",
      "  if (shieldHealth < 20) {",
      "    console.log('Emergency boost triggered');",
      "  ",
      "  return shieldHealth + 10;",
      "}"
    ],
    bugLine: 3,
    explanation: "The 'if' condition scope bracket is never closed, leaving the function block syntactically broken.",
    correction: "  }"
  },
  {
    language: "htmlcss",
    title: "Level 4: CSS Tag Selection Closure",
    code: [
      ".deflector-core {",
      "  width: 80px;",
      "  height: 80px;",
      "  background: #ff007f",
      "  border: 1px solid #fff;",
      "}"
    ],
    bugLine: 3,
    explanation: "The CSS property on line 4 is missing a trailing semicolon, which causes subsequent rules to fail.",
    correction: "  background: #ff007f;"
  },
  {
    language: "python",
    title: "Level 5: List Index Out of Bounds",
    code: [
      "# Retreiving items from sector checklist",
      "cargo = ['fuel', 'shields']",
      "print(cargo[0])",
      "print(cargo[2])"
    ],
    bugLine: 3,
    explanation: "The array 'cargo' only has index 0 ('fuel') and index 1 ('shields'). Querying index 2 throws an IndexError in Python.",
    correction: "print(cargo[1])"
  }
];

class BugHuntGame {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.timer = 30;
    this.timerInterval = null;
    this.activeLevelIndex = 0;
    this.gameActive = false;
    this.highScore = Number(localStorage.getItem("bughunt_highscore") || "0");
  }

  init() {
    // Bind UI elements
    this.livesContainer = document.getElementById("game-hearts");
    this.scoreText = document.getElementById("game-score");
    this.highScoreText = document.getElementById("game-highscore");
    this.timerBar = document.getElementById("game-timer-bar");
    this.codeBoard = document.getElementById("game-code-board");
    
    this.levelTitle = document.getElementById("game-level-title");
    this.mascotBubble = document.getElementById("game-mascot-bubble");

    this.highScoreText.textContent = this.highScore;

    this.startLevel();
  }

  startLevel() {
    this.gameActive = true;
    this.timer = 30;
    this.timerBar.style.width = "100%";
    
    const level = BUG_LEVELS[this.activeLevelIndex];
    this.levelTitle.textContent = `${level.title} (${level.language.toUpperCase()})`;
    this.mascotBubble.textContent = "Quick, scan the codebase! One of these lines is throwing a major compiler warning. Click the buggy line to zap it!";
    Mascot.setMood("game-mascot", "explaining");

    // Render code board
    this.codeBoard.innerHTML = "";
    level.code.forEach((line, idx) => {
      const row = document.createElement("div");
      row.className = "code-line-target";
      row.innerHTML = `
        <span class="line-number">${idx + 1}</span>
        <span style="white-space: pre-wrap;">${this.escapeHTML(line)}</span>
      `;
      row.addEventListener("click", () => this.handleLineClick(idx, row));
      this.codeBoard.appendChild(row);
    });

    // Start timer loop
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timer--;
      const pct = (this.timer / 30) * 100;
      this.timerBar.style.width = `${pct}%`;

      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.triggerGameOver("Time limit exceeded! The reactor overheated.");
      }
    }, 1000);
  }

  handleLineClick(lineIdx, element) {
    if (!this.gameActive) return;

    const level = BUG_LEVELS[this.activeLevelIndex];

    if (lineIdx === level.bugLine) {
      // SUCCESS ZAP!
      this.gameActive = false;
      clearInterval(this.timerInterval);
      element.classList.add("zap-effect");
      
      this.score += 50;
      this.scoreText.textContent = this.score;
      
      // Award actual persistent state XP points!
      State.addXP(25); // +25 XP per correct zap!

      this.mascotBubble.innerHTML = `
        <span style="color: var(--accent-green); font-weight:bold;">✓ SYNTAX BUG ZAPPED!</span><br>
        ${level.explanation}
      `;
      Mascot.setMood("game-mascot", "happy");

      setTimeout(() => {
        this.proceedNextLevel();
      }, 3500);
    } else {
      // WRONG ZAP
      element.classList.add("laser-error-effect");
      this.lives--;
      this.renderLives();
      
      this.mascotBubble.textContent = "Warning, that line is nominal! The deflector lasers backfired. Try scanning again!";
      Mascot.setMood("game-mascot", "thinking");

      if (this.lives <= 0) {
        clearInterval(this.timerInterval);
        this.triggerGameOver("System structural failure! Out of structural lives.");
      }
    }
  }

  proceedNextLevel() {
    this.activeLevelIndex++;
    if (this.activeLevelIndex < BUG_LEVELS.length) {
      this.startLevel();
    } else {
      // Victory!
      this.triggerVictory();
    }
  }

  renderLives() {
    this.livesContainer.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement("span");
      heart.textContent = i < this.lives ? "❤️" : "🖤";
      this.livesContainer.appendChild(heart);
    }
  }

  triggerGameOver(reason) {
    this.gameActive = false;
    Mascot.setMood("game-mascot", "thinking");

    // Show Game Over Modal
    const modal = document.createElement("div");
    modal.className = "game-modal";
    modal.innerHTML = `
      <div class="panel modal-card" style="border-color: var(--accent-pink);">
        <h2 style="color: var(--accent-pink); font-size: 2rem; margin-bottom: 10px;">Reactor Shutdown</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">${reason}</p>
        <div style="font-size: 1.25rem; font-weight: bold; margin-bottom: 24px;">Zapped Score: ${this.score} pts</div>
        <button onclick="restartBugHunt()" class="btn btn-pink">Restart Core</button>
        <a href="dashboard.html" class="btn btn-muted" style="margin-top:10px;">Exit Arena</a>
      </div>
    `;
    document.body.appendChild(modal);
  }

  triggerVictory() {
    this.gameActive = false;
    Mascot.setMood("game-mascot", "happy");

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("bughunt_highscore", this.highScore);
    }

    // Award bonus victory achievements
    State.addXP(100); // 100 Bonus Victory XP!
    
    // Unlock first badge if not already
    State.unlockBadge("first_step");

    const modal = document.createElement("div");
    modal.className = "game-modal";
    modal.innerHTML = `
      <div class="panel modal-card" style="border-color: var(--accent-green); box-shadow: 0 0 25px rgba(57,255,20,0.2);">
        <h2 style="color: var(--accent-green); font-size: 2rem; margin-bottom: 10px;">Arena Cleared!</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Spectacular scan operations, Officer! You zapped every compiler hazard in the sector.</p>
        <div style="font-size: 1.25rem; font-weight: bold; margin-bottom: 4px;">Final Score: ${this.score} pts</div>
        <div style="font-size: 0.85rem; color: var(--accent-green); font-weight: bold; margin-bottom: 24px;">+100 Bonus Victory XP Added!</div>
        <a href="dashboard.html" class="btn btn-green">Return to Flight Deck</a>
      </div>
    `;
    document.body.appendChild(modal);
  }

  escapeHTML(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Global Launcher hooks
let gameInstance = null;

window.launchBugHunt = function() {
  gameInstance = new BugHuntGame();
  gameInstance.init();
};

window.restartBugHunt = function() {
  // Remove modal
  const modals = document.querySelectorAll(".game-modal");
  modals.forEach(m => m.remove());
  
  // Re-boot
  window.launchBugHunt();
};
