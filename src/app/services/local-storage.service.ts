import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  private isLocalStorageAvailable(): boolean {
    try {
      localStorage.setItem('__test__', '__test__');
      localStorage.removeItem('__test__');
      return true;
    } catch (e) {
      return false;
    }
  }

  saveToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string): any {
    if (this.isLocalStorageAvailable()) {
      const item = localStorage.getItem(key);
      return item;
    } else {
      return null;
    }
  }

  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
}
