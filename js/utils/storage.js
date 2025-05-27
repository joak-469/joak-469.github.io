// Storage Manager for handling localStorage operations
export class LoveStorageManager {
  constructor() {
    this.prefix = 'cosmic-love-';
  }

  // Get item from localStorage
  get(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  // Set item in localStorage
  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting item in storage:', error);
      return false;
    }
  }

  // Remove item from localStorage
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing item from storage:', error);
      return false;
    }
  }

  // Get array from localStorage
  getArray(key) {
    const item = this.get(key);
    return Array.isArray(item) ? item : [];
  }

  // Add item to array in localStorage
  addToArray(key, item) {
    const array = this.getArray(key);
    array.unshift(item);
    return this.set(key, array);
  }

  // Remove item from array in localStorage
  removeFromArray(key, predicate) {
    const array = this.getArray(key);
    const filteredArray = array.filter(item => !predicate(item));
    return this.set(key, filteredArray);
  }

  // Clear all app data
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Export all data
  exportData() {
    try {
      const data = {};
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const cleanKey = key.replace(this.prefix, '');
          data[cleanKey] = this.get(cleanKey);
        }
      });
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  // Import data
  importData(data) {
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}