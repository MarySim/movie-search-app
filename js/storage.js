import { STORAGE_KEYS } from './config.js';
import { Movie } from './movie.js';

export class AppStorage {
  getUserName() {
    return localStorage.getItem(STORAGE_KEYS.userName) || '';
  }

  saveUserName(name) {
    localStorage.setItem(STORAGE_KEYS.userName, name.trim());
  }

  clearUserName() {
    localStorage.removeItem(STORAGE_KEYS.userName);
  }

  getFavorites() {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return parsed.map((item) => Movie.fromStorage(item));
    } catch {
      this.saveFavorites([]);
      return [];
    }
  }

  saveFavorites(movies) {
    const prepared = movies.map((movie) => movie.toPlainObject());
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(prepared));
  }

  isFavorite(movieId) {
    return this.getFavorites().some((movie) => movie.id === movieId);
  }

  addFavorite(movie) {
    const favorites = this.getFavorites();

    if (!favorites.some((item) => item.id === movie.id)) {
      favorites.push(movie);
      this.saveFavorites(favorites);
    }
  }

  removeFavorite(movieId) {
    const favorites = this.getFavorites().filter((movie) => movie.id !== movieId);
    this.saveFavorites(favorites);
  }

  toggleFavorite(movie) {
    if (this.isFavorite(movie.id)) {
      this.removeFavorite(movie.id);
      return false;
    }

    this.addFavorite(movie);
    return true;
  }
}
