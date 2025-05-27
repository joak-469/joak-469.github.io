// PWA Manager for handling PWA features
export class PWAManager {
  constructor() {
    this.installPrompt = null;
    this.isInstalled = false;
  }

  init() {
    this.setupInstallPrompt();
    this.setupUpdateHandler();
    this.setupPushNotifications();
    this.checkInstallStatus();
  }

  setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.installPrompt = e;
      this.showInstallPrompt();
    });

    // Install button
    const installBtn = document.getElementById("installBtn");
    if (installBtn) {
      installBtn.addEventListener("click", () => this.installApp());
    }

    const dismissInstall = document.getElementById("dismissInstall");
    if (dismissInstall) {
      dismissInstall.addEventListener("click", () => this.dismissInstallPrompt());
    }
  }

  setupUpdateHandler() {
    const updateBtn = document.getElementById("updateBtn");
    const dismissUpdate = document.getElementById("dismissUpdate");

    if (updateBtn) {
      updateBtn.addEventListener("click", () => this.updateApp());
    }

    if (dismissUpdate) {
      dismissUpdate.addEventListener("click", () => this.dismissUpdatePrompt());
    }
  }

  async setupPushNotifications() {
    if ("Notification" in window && "serviceWorker" in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted");
      }
    }
  }

  checkInstallStatus() {
    // Check if app is installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      this.isInstalled = true;
      this.dismissInstallPrompt();
    }
  }

  showInstallPrompt() {
    if (!this.isInstalled) {
      const installPrompt = document.getElementById("installPrompt");
      if (installPrompt) {
        installPrompt.classList.remove("hidden");
      }
    }
  }

  async installApp() {
    if (this.installPrompt) {
      const result = await this.installPrompt.prompt();
      console.log("Install prompt result:", result);

      this.dismissInstallPrompt();
      this.installPrompt = null;

      if (result.outcome === 'accepted') {
        this.isInstalled = true;
        if (window.app) {
          window.app.showToast("App installed successfully! 🎉", "success");
        }
      }
    }
  }

  dismissInstallPrompt() {
    const installPrompt = document.getElementById("installPrompt");
    if (installPrompt) {
      installPrompt.classList.add("hidden");
    }
  }

  updateApp() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  }

  dismissUpdatePrompt() {
    const updatePrompt = document.getElementById("updatePrompt");
    if (updatePrompt) {
      updatePrompt.classList.add("hidden");
    }
  }

  // Send push notification (for testing)
  sendTestNotification(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/placeholder.svg?height=192&width=192&query=love heart icon",
        badge: "/placeholder.svg?height=72&width=72&query=love notification badge",
        vibrate: [200, 100, 200]
      });
    }
  }
}
