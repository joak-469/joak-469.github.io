// Quiz Component
export class QuizComponent {
  constructor(container) {
    this.container = container;
    this.currentQuestion = 1;
    this.totalQuestions = 3;
    this.quizAnswers = {};
    this.startTime = null;
    this.storage = new StorageManager();
    
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.loadQuizStats();
  }

  render() {
    this.container.innerHTML = `
      <div class="page-header">
        <h2>💕 How Well Do You Know Us?</h2>
        <p>Test your knowledge about our love story</p>
        <div class="quiz-stats">
          <div class="stat-box">
            <span class="stat-value" id="bestScore">0/3</span>
            <span class="stat-label">Best Score</span>
          </div>
          <div class="stat-box">
            <span class="stat-value" id="quizAttempts">0</span>
            <span class="stat-label">Attempts</span>
          </div>
          <div class="stat-box">
            <span class="stat-value" id="averageScore">0%</span>
            <span class="stat-label">Average</span>
          </div>
        </div>
      </div>
      
      <div class="quiz-container">
        <div class="quiz-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="quizProgress"></div>
          </div>
          <span class="progress-text">Question <span id="currentQuestion">1</span> of <span id="totalQuestions">3</span></span>
          <div class="quiz-timer">
            <span class="timer-icon">⏱️</span>
            <span id="quizTimer">00:00</span>
          </div>
        </div>

        <form id="quizForm" class="quiz-form">
          <div class="question-card active" data-question="1">
            <div class="question-header">
              <span class="question-number">1</span>
              <div class="question-difficulty">Easy</div>
            </div>
            <h3>What's our favorite song to dance to?</h3>
            <div class="options">
              <label class="option">
                <input type="radio" name="q1" value="tujh-mein-rab">
                <span class="option-text">Tujh Mein Rab Dikhta Hai</span>
                <span class="option-icon">🎵</span>
              </label>
              <label class="option">
                <input type="radio" name="q1" value="perfect">
                <span class="option-text">Perfect by Ed Sheeran</span>
                <span class="option-icon">🎶</span>
              </label>
              <label class="option">
                <input type="radio" name="q1" value="thinking-out-loud">
                <span class="option-text">Thinking Out Loud</span>
                <span class="option-icon">🎤</span>
              </label>
            </div>
          </div>

          <div class="question-card" data-question="2">
            <div class="question-header">
              <span class="question-number">2</span>
              <div class="question-difficulty">Medium</div>
            </div>
            <h3>Where did we first meet?</h3>
            <div class="options">
              <label class="option">
                <input type="radio" name="q2" value="coffee-shop">
                <span class="option-text">A cozy coffee shop</span>
                <span class="option-icon">☕</span>
              </label>
              <label class="option">
                <input type="radio" name="q2" value="under-stars">
                <span class="option-text">Under the stars</span>
                <span class="option-icon">⭐</span>
              </label>
              <label class="option">
                <input type="radio" name="q2" value="online">
                <span class="option-text">In the digital cosmos</span>
                <span class="option-icon">💻</span>
              </label>
            </div>
          </div>

          <div class="question-card" data-question="3">
            <div class="question-header">
              <span class="question-number">3</span>
              <div class="question-difficulty">Hard</div>
            </div>
            <h3>What's my favorite thing about you?</h3>
            <div class="options">
              <label class="option">
                <input type="radio" name="q3" value="smile">
                <span class="option-text">Your radiant smile</span>
                <span class="option-icon">😊</span>
              </label>
              <label class="option">
                <input type="radio" name="q3" value="laugh">
                <span class="option-text">Your infectious laugh</span>
                <span class="option-icon">😄</span>
              </label>
              <label class="option">
                <input type="radio" name="q3" value="everything">
                <span class="option-text">Everything about you</span>
                <span class="option-icon">💖</span>
              </label>
            </div>
          </div>

          <div class="quiz-navigation">
            <button type="button" id="prevQuestion" class="btn-secondary" disabled>
              <span>← Previous</span>
            </button>
            <div class="quiz-hints">
              <button type="button" id="hintBtn" class="btn-hint">💡 Hint</button>
              <span class="hints-remaining">3 hints left</span>
            </div>
            <button type="button" id="nextQuestion" class="btn-primary">
              <span>Next →</span>
            </button>
            <button type="submit" id="submitQuiz" class="btn-primary hidden">
              <span>✨ Submit Quiz</span>
            </button>
          </div>
        </form>

        <div id="quizResult" class="quiz-result hidden">
          <div class="result-content">
            <div class="result-animation">
              <div class="celebration-stars">⭐✨🌟💫⭐</div>
            </div>
            <div class="result-score">
              <span class="score-number" id="finalScore">0</span>
              <span class="score-total">/3</span>
            </div>
            <h3 id="resultTitle">Amazing!</h3>
            <p id="resultMessage">You know us so well!</p>
            <div class="result-details">
              <div class="detail-item">
                <span class="detail-label">Time taken:</span>
                <span class="detail-value" id="timeTaken">0:00</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Accuracy:</span>
                <span class="detail-value" id="accuracy">0%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Points earned:</span>
                <span class="detail-value" id="pointsEarned">0</span>
              </div>
            </div>
            <div class="result-actions">
              <button id="shareQuiz" class="btn-primary">📤 Share Result</button>
              <button id="retakeQuiz" class="btn-secondary">🔄 Try Again</button>
              <button id="reviewAnswers" class="btn-secondary">📝 Review</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const quizForm = document.getElementById("quizForm");
    const prevBtn = document.getElementById("prevQuestion");
    const nextBtn = document.getElementById("nextQuestion");

    if (quizForm) {
      quizForm.addEventListener("submit", (e) => this.handleQuizSubmit(e));
    }

    if (prevBtn) prevBtn.addEventListener("click", () => this.previousQuestion());
    if (nextBtn) nextBtn.addEventListener("click", () => this.nextQuestion());

    this.startTimer();
    this.updateQuizProgress();
    this.showQuestion(1);
  }

  loadQuizStats() {
    const bestScore = this.storage.get("bestQuizScore") || 0;
    const attempts = this.storage.get("quizAttempts") || 0;
    const totalScore = this.storage.get("totalQuizScore") || 0;
    const averageScore = attempts > 0 ? Math.round((totalScore / attempts / this.totalQuestions) * 100) : 0;

    document.getElementById("bestScore").textContent = `${bestScore}/${this.totalQuestions}`;
    document.getElementById("quizAttempts").textContent = attempts;
    document.getElementById("averageScore").textContent = `${averageScore}%`;
  }

  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      document.getElementById("quizTimer").textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  showQuestion(questionNumber) {
    document.querySelectorAll(".question-card").forEach((card) => {
      card.classList.remove("active");
    });

    const currentCard = document.querySelector(`[data-question="${questionNumber}"]`);
    if (currentCard) {
      currentCard.classList.add("active");
    }

    this.updateQuizNavigation();
    this.updateQuizProgress();
  }

  updateQuizNavigation() {
    const prevBtn = document.getElementById("prevQuestion");
    const nextBtn = document.getElementById("nextQuestion");
    const submitBtn = document.getElementById("submitQuiz");

    prevBtn.disabled = this.currentQuestion === 1;

    if (this.currentQuestion === this.totalQuestions) {
      nextBtn.classList.add("hidden");
      submitBtn.classList.remove("hidden");
    } else {
      nextBtn.classList.remove("hidden");
      submitBtn.classList.add("hidden");
    }
  }

  updateQuizProgress() {
    const progress = (this.currentQuestion / this.totalQuestions) * 100;
    document.getElementById("quizProgress").style.width = `${progress}%`;
    document.getElementById("currentQuestion").textContent = this.currentQuestion;
    document.getElementById("totalQuestions").textContent = this.totalQuestions;
  }

  nextQuestion() {
    if (this.currentQuestion < this.totalQuestions) {
      this.currentQuestion++;
      this.showQuestion(this.currentQuestion);
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 1) {
      this.currentQuestion--;
      this.showQuestion(this.currentQuestion);
    }
  }

  handleQuizSubmit(e) {
    e.preventDefault();
    clearInterval(this.timerInterval);

    const formData = new FormData(e.target);
    let score = 0;

    const correctAnswers = {
      q1: "tujh-mein-rab",
      q2: "under-stars",
      q3: "everything",
    };

    for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
      if (formData.get(question) === correctAnswer) {
        score++;
      }
    }

    this.showQuizResult(score);
    this.saveQuizResult(score);
  }

  showQuizResult(score) {
    const quizForm = document.querySelector(".quiz-form");
    const quizResult = document.getElementById("quizResult");

    quizForm.style.display = "none";
    quizResult.classList.remove("hidden");

    const elapsed = Date.now() - this.startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    document.getElementById("finalScore").textContent = score;
    document.getElementById("timeTaken").textContent = timeString;
    document.getElementById("accuracy").textContent = `${Math.round((score / this.totalQuestions) * 100)}%`;
    document.getElementById("pointsEarned").textContent = score * 10;

    const percentage = (score / this.totalQuestions) * 100;
    let title, message;

    if (percentage >= 80) {
      title = "Amazing! 🌟";
      message = "You know us perfectly! Our love is truly cosmic! ✨";
    } else if (percentage >= 60) {
      title = "Great job! 💕";
      message = "You understand our love story so well! 💫";
    } else {
      title = "Keep learning! 💭";
      message = "Our love story is still unfolding! ⭐";
    }

    document.getElementById("resultTitle").textContent = title;
    document.getElementById("resultMessage").textContent = message;

    this.setupResultActions(score);
  }

  setupResultActions(score) {
    document.getElementById("shareQuiz").addEventListener("click", () => {
      this.shareQuizResult(score);
    });

    document.getElementById("retakeQuiz").addEventListener("click", () => {
      this.retakeQuiz();
    });
  }

  saveQuizResult(score) {
    const bestScore = this.storage.get("bestQuizScore") || 0;
    if (score > bestScore) {
      this.storage.set("bestQuizScore", score);
    }

    const attempts = parseInt(this.storage.get("quizAttempts") || 0) + 1;
    this.storage.set("quizAttempts", attempts);

    const totalScore = parseInt(this.storage.get("totalQuizScore") || 0) + score;
    this.storage.set("totalQuizScore", totalScore);
  }

  shareQuizResult(score) {
    if (navigator.share) {
      navigator.share({
        title: "Cosmic Love Quiz Result",
        text: `I scored ${score}/${this.totalQuestions} on our love quiz! 💕`,
        url: window.location.href,
      });
    } else {
      const text = `I scored ${score}/${this.totalQuestions} on our cosmic love quiz! 💕 ${window.location.href}`;
      navigator.clipboard.writeText(text).then(() => {
        if (window.app) {
          window.app.showToast("Result copied to clipboard! 📋", "success");
        }
      });
    }
  }

  retakeQuiz() {
    const quizForm = document.querySelector(".quiz-form");
    const quizResult = document.getElementById("quizResult");

    quizResult.classList.add("hidden");
    quizForm.style.display = "block";

    document.getElementById("quizForm").reset();
    this.currentQuestion = 1;
    this.showQuestion(1);
    this.startTimer();
  }
}

// Make QuizComponent available globally
window.QuizComponent = QuizComponent;
