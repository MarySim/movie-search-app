import { MovieApi } from './api.js';
import { Store } from './store.js';
import { View } from './view.js';
import { App } from './app.js';

// Ключ API (замени на свой)
const API_KEY = 'c24650b8';

// Создаём экземпляры модулей
const api = new MovieApi(API_KEY);
const store = new Store();
const view = new View();
const app = new App(api, store, view);

// Запускаем приложение
app.init();