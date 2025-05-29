import { LoveStorageManager } from './utils/storage.js';
import { PWAManager } from './utils/pwa.js';


console.log('Imported LoveStorageManager:', typeof LoveStorageManager); // Should be "function"
console.log('Imported PWAManager:', typeof PWAManager);    


// Main App JavaScript
export class CosmicLoveApp {
  constructor() {
    if (typeof LoveStorageManager === 'undefined') {
      console.error('LoveStorageManager is not defined!');
    }
    if (typeof PWAManager === 'undefined') {
      console.error('PWAManager is not defined!');
    }
    this.installPrompt = null;
    this.backgroundMusic = document.getElementById('backgroundMusic');
    this.currentPage = "home";
    this.isOnline = navigator.onLine;
    this.startDate = new Date("2024-01-01");
    this.storage = new LoveStorageManager();
    this.pwa = new PWAManager();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadInitialData();
    this.startDayCounter();
    this.pwa.init();
    this.handleOfflineMode();
    this.setupAudioControls();
    // Hide loading screen after initialization
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 2000);
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        this.navigateToPage(page);
      });
    });

    // Quick actions
    document.querySelectorAll(".action-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleQuickAction(action);
      });
    });

    // FAB menu
    const fabMain = document.getElementById("fabMain");
    if (fabMain) {
      fabMain.addEventListener("click", () => this.toggleFabMenu());
    }

    // FAB items
    document.querySelectorAll(".fab-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleFabAction(action);
      });
    });

    // Online/offline detection
    window.addEventListener("online", () => this.handleOnlineStatus(true));
    window.addEventListener("offline", () => this.handleOnlineStatus(false));


    // Theme toggle
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Weekly challenge
    const challengeBtn = document.querySelector(".challenge-btn");
    if (challengeBtn) {
      challengeBtn.addEventListener("click", () => this.completeChallenge());
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    const app = document.getElementById("app");

    if (loadingScreen && app) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
        app.classList.remove("hidden");
      }, 500);
    }
  }

  navigateToPage(page) {
    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    document.querySelector(`[data-page="${page}"]`).classList.add("active");

    // Update pages
    document.querySelectorAll(".page").forEach((pageElement) => {
      pageElement.classList.remove("active");
    });
    
    const targetPage = document.getElementById(page);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    this.currentPage = page;

    // Load page-specific content
    this.loadPageContent(page);
  }

  async loadPageContent(page) {
    const targetPage = document.getElementById(page);
    
    // If page is empty, load content dynamically
    if (targetPage && targetPage.innerHTML.trim() === '') {
      try {
        const response = await fetch(`pages/${page}.html`);
        if (response.ok) {
          const content = await response.text();
          targetPage.innerHTML = content;
          
          // Initialize page-specific functionality
          this.initializePageFeatures(page);
        }
      } catch (error) {
        console.error(`Failed to load ${page} content:`, error);
        // Fallback to inline content generation
        this.generatePageContent(page);
      }
    }

    // Load page-specific data
    this.loadPageData(page);
  }

  generatePageContent(page) {
    const targetPage = document.getElementById(page);
    
    switch (page) {
      case 'quiz':
        if (window.QuizComponent) {
          new QuizComponent(targetPage);
        }
        break;
      case 'confess':
        if (window.ConfessionComponent) {
          new ConfessionComponent(targetPage);
        }
        break;
      case 'dreams':
        if (window.DreamsComponent) {
          new DreamsComponent(targetPage);
        }
        break;
      case 'memories':
        if (window.MemoriesComponent) {
          new MemoriesComponent(targetPage);
        }
        break;
    }
  }

  initializePageFeatures(page) {
    switch (page) {
      case 'quiz':
        this.initializeQuiz();
        break;
      case 'confess':
        this.initializeConfession();
        break;
      case 'dreams':
        this.initializeDreams();
        break;
      case 'memories':
        this.initializeMemories();
        break;
    }
  }

  loadPageData(page) {
    switch (page) {
      case "home":
        this.updateStats();
        break;
      case "quiz":
        this.loadQuizData();
        break;
      case "confess":
        this.loadConfessionData();
        break;
      case "dreams":
        this.loadDreamsData();
        break;
      case "memories":
        this.loadMemoriesData();
        break;
    }
  }

  handleQuickAction(action) {
    switch (action) {
      case "daily-love":
        this.openQuickNote();
        break;
      case "mood-tracker":
        this.openMoodTracker();
        break;
      case "photo-memory":
        this.openPhotoCapture();
        break;
      case "love-generator":
        this.generateLoveQuote();
        break;
    }
  }

  generateLoveQuote() {
    const quotes = [
      "Love is not just looking at each other, it's looking in the same direction. 💫",
      "You are my today and all of my tomorrows. ✨",
      "In a sea of people, my eyes will always search for you. 🌊",
      "You are my favorite notification. 💌",
      "Every love story is beautiful, but ours is my favorite. 📖",
      "You're the reason I look down at my phone and smile. 😊",
      "Distance means nothing when someone means everything. 🌍",
      "You are my person, my love, my life. 💕",
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    this.showToast(randomQuote, "success", 5000);
  }

  // FAB functionality
  toggleFabMenu() {
    const fabMenu = document.querySelector(".fab-menu");
    fabMenu.classList.toggle("hidden");
    fabMenu.classList.toggle("active");
  }

  handleFabAction(action) {
    this.toggleFabMenu(); // Close menu

    switch (action) {
      case "quick-note":
        this.openQuickNote();
        break;
      case "mood":
        this.openMoodTracker();
        break;
      case "camera":
        this.openPhotoCapture();
        break;
      case "share":
        this.shareApp();
        break;
      case "settings":
        this.openSettings();
        break;
    }
  }

  // Utility functions
  startDayCounter() {
    const updateCounter = () => {
      const now = new Date();
      const diffTime = Math.abs(now - this.startDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

      const counter = document.getElementById("daysCounter");
      const hoursCount = document.getElementById("hoursCount");
      const minutesCount = document.getElementById("minutesCount");

      if (counter) counter.textContent = diffDays;
      if (hoursCount) hoursCount.textContent = diffHours;
      if (minutesCount) minutesCount.textContent = diffMinutes;
    };

    updateCounter();
    setInterval(updateCounter, 1000 * 60); // Update every minute
  }

  loadInitialData() {
    this.updateStats();

    // Set last visit
    const lastVisit = this.storage.get("lastVisit");
    const now = new Date().toLocaleString();

    if (lastVisit) {
      console.log(`Last visit: ${lastVisit}`);
    }

    this.storage.set("lastVisit", now);

    // Track total visits
    const visits = parseInt(this.storage.get("totalVisits") || 0) + 1;
    this.storage.set("totalVisits", visits);
  }

  updateStats() {
    const confessionCount = this.storage.getArray("confessions").length;
    const memoriesCount = this.storage.getArray("memories").length;
    const dreamCount = this.storage.getArray("dreams").length;
    const quizScore = this.storage.get("bestQuizScore") || 0;

    const elements = {
      confessionCount: confessionCount,
      memoriesCount: memoriesCount,
      dreamCount: dreamCount,
      quizScore: quizScore
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    // Update trends
    this.updateTrends();
  }

  updateTrends() {
    // Calculate weekly confession trend
    const confessions = this.storage.getArray("confessions");
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyConfessions = confessions.filter(c => new Date(c.timestamp) > weekAgo).length;
    
    const confessionTrend = document.getElementById("confessionTrend");
    if (confessionTrend) confessionTrend.textContent = weeklyConfessions;

    // Calculate monthly memories trend
    const memories = this.storage.getArray("memories");
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyMemories = memories.filter(m => new Date(m.timestamp) > monthAgo).length;
    
    const memoriesTrend = document.getElementById("memoriesTrend");
    if (memoriesTrend) memoriesTrend.textContent = monthlyMemories;
  }

  completeChallenge() {
    const challengeBtn = document.querySelector(".challenge-btn");
    challengeBtn.textContent = "✅ Completed!";
    challengeBtn.disabled = true;
    challengeBtn.style.background = "#4CAF50";

    // Save completion
    const today = new Date().toDateString();
    this.storage.set("lastChallengeCompleted", today);

    this.showToast("Challenge completed! You're amazing! 🌟", "success");

    // Update progress
    const progress = this.storage.get("challengeProgress") || 0;
    const newProgress = Math.min(progress + 1, 7);
    this.storage.set("challengeProgress", newProgress);
    
    const progressFill = document.getElementById("challengeProgress");
    if (progressFill) {
      progressFill.style.width = `${(newProgress / 7) * 100}%`;
    }
  }

  // Theme functionality
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'cosmic';
    const themes = ['cosmic', 'romantic', 'nature', 'sunset'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    document.documentElement.setAttribute('data-theme', nextTheme);
    this.storage.set('selectedTheme', nextTheme);
    
    this.showToast(`Switched to ${nextTheme} theme! 🎨`, "success");
  }

toggleMusic() {
  const backgroundMusic = this.backgroundMusic;
  const musicBtn = document.getElementById("musicToggle");
  const musicIcon = musicBtn ? musicBtn.querySelector(".music-icon") : null;

  if (!backgroundMusic) {
    console.warn("No backgroundMusic element found!");
    return;
  }

  if (backgroundMusic.paused) {
    backgroundMusic.play().then(() => {
      if (musicIcon) musicIcon.textContent = "🎵";
      this.showToast("Music playing 🎶", "success");
    }).catch((err) => {
      this.showToast("Tap again to start the music.", "info");
      console.warn("Music play failed:", err);
    });
  } else {
    backgroundMusic.pause();
    if (musicIcon) musicIcon.textContent = "🔇";
    this.showToast("Music paused 🎵", "info");
  }
}

  // Online/Offline functionality
  handleOnlineStatus(isOnline) {
    this.isOnline = isOnline;

    const statusElement = document.querySelector(".connection-status");
    const statusDot = document.querySelector(".status-dot");
    const statusText = document.querySelector(".status-text");

    if (statusElement && statusDot && statusText) {
      if (isOnline) {
        statusElement.classList.add("online");
        statusElement.classList.remove("offline");
        statusDot.style.background = "#4CAF50";
        statusText.textContent = "Connected";
      } else {
        statusElement.classList.add("offline");
        statusElement.classList.remove("online");
        statusDot.style.background = "#FF5252";
        statusText.textContent = "Offline";
      }
    }

    if (isOnline) {
      this.showToast("Back online! 🌐", "success");
    } else {
      this.showToast("You're offline. Don't worry, your love data is safe! 💾", "warning");
    }
  }

  handleOfflineMode() {
    if (!navigator.onLine) {
      this.handleOnlineStatus(false);
    }
  }

  // Sharing functionality
  shareApp() {
    const shareData = {
      title: "Our Cosmic Love",
      text: "Check out our beautiful love story app! 💕✨",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      const text = `${shareData.text} ${shareData.url}`;
      navigator.clipboard.writeText(text).then(() => {
        this.showToast("Link copied to clipboard! 📋", "success");
      });
    }
  }

setupAudioControls() {
  const musicToggle = document.getElementById("musicToggle");
  const volumeSlider = document.getElementById("volumeSlider");
  const backgroundMusic = this.backgroundMusic;

  // Debug log
  console.log("setupAudioControls: backgroundMusic:", backgroundMusic);

  // Play music on first user gesture
  const enableMusic = () => {
    if (backgroundMusic && backgroundMusic.paused) {
      backgroundMusic.volume = volumeSlider?.value || 0.3;
      backgroundMusic.play().then(() => {
        console.log("Music started by user gesture!");
      }).catch((err) => {
        this.showToast("Tap again to start the music.", "info");
        console.warn("Music play failed:", err);
      });
    }
    document.body.removeEventListener("click", enableMusic);
  };
  document.body.addEventListener("click", enableMusic);

  // Toggle music on button
  if (musicToggle) {
    musicToggle.addEventListener("click", () => this.toggleMusic());
  }

  // Volume control
  if (volumeSlider && backgroundMusic) {
    volumeSlider.addEventListener("input", () => {
      backgroundMusic.volume = volumeSlider.value;
    });
  }
}

  // Placeholder methods for page-specific functionality
  loadQuizData() { /* Implemented in quiz.js */ }
  loadConfessionData() { /* Implemented in confession.js */ }
  loadDreamsData() { /* Implemented in dreams.js */ }
  loadMemoriesData() { /* Implemented in memories.js */ }
  
  initializeQuiz() { /* Implemented in quiz.js */ }
  initializeConfession() { /* Implemented in confession.js */ }
  initializeDreams() { /* Implemented in dreams.js */ }
  initializeMemories() { /* Implemented in memories.js */ }
  
  openQuickNote() { /* To be implemented */ }
  openMoodTracker() { /* To be implemented */ }
  openPhotoCapture() { /* To be implemented */ }
  openSettings() { /* To be implemented */ }
}

function isInstagramBrowser() {
  return navigator.userAgent.includes('Instagram');
}

document.addEventListener("DOMContentLoaded", () => {
  if (isInstagramBrowser()) {
    alert('For the best experience and to install this app, please open in your browser (Chrome/Safari). Instagram in-app browser does not support installation.');
  }
  try {
    window.app = new CosmicLoveApp();
  } catch (e) {
    console.error('Failed to create app:', e);
  }
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) backToTop.style.display = "block";
    else backToTop.style.display = "none";
  });
  backToTop.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
});


// Handle app state changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    if (window.app) {
      window.app.updateStats();
    }
  }
}



);
