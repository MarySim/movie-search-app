import { DEFAULT_SEARCH, DEFAULT_TYPE } from './config.js';
import { MovieApi } from './api.js';
import { AppStorage } from './storage.js';
import { MovieRenderer } from './renderer.js';
import { averageRating, debounce, filterByGenre, sortMovies, uniqueGenres } from './utils.js';
import { getFallbackMovies } from './fallback.js';

class KinozalApp {
  constructor() {
    this.api = new MovieApi();
    this.storage = new AppStorage();
    this.state = {
      userName: '',
      movies: [],
      totalResults: 0,
      currentQuery: DEFAULT_SEARCH,
      currentType: DEFAULT_TYPE,
      currentPage: 1,
      favoritesMode: false,
      isLoading: false
    };

    this.elements = this.getElements();
    this.renderer = new MovieRenderer(this.elements.results, this.elements.modalBody);
  }

  getElements() {
    return {
      welcomeScreen: document.querySelector('#welcomeScreen'),
      welcomeForm: document.querySelector('#welcomeForm'),
      userName: document.querySelector('#userName'),
      appScreen: document.querySelector('#appScreen'),
      greeting: document.querySelector('#greeting'),
      headerHint: document.querySelector('#headerHint'),
      changeUserBtn: document.querySelector('#changeUserBtn'),
      searchForm: document.querySelector('#searchForm'),
      searchInput: document.querySelector('#searchInput'),
      typeSelect: document.querySelector('#typeSelect'),
      genreSelect: document.querySelector('#genreSelect'),
      sortSelect: document.querySelector('#sortSelect'),
      viewSelect: document.querySelector('#viewSelect'),
      favoritesBtn: document.querySelector('#favoritesBtn'),
      statsPanel: document.querySelector('#statsPanel'),
      totalCount: document.querySelector('#totalCount'),
      favoriteCount: document.querySelector('#favoriteCount'),
      averageRating: document.querySelector('#averageRating'),
      message: document.querySelector('#message'),
      results: document.querySelector('#results'),
      loadMoreBtn: document.querySelector('#loadMoreBtn'),
      modal: document.querySelector('#movieModal'),
      modalBody: document.querySelector('#modalBody')
    };
  }

  init() {
    this.bindEvents();
    const savedName = this.storage.getUserName();

    if (savedName) {
      this.elements.userName.value = savedName;
    }

    this.showWelcome();
  }

  bindEvents() {
    this.elements.welcomeForm.addEventListener('submit', (event) => this.handleWelcomeSubmit(event));
    this.elements.searchForm.addEventListener('submit', (event) => this.handleSearchSubmit(event));
    this.elements.changeUserBtn.addEventListener('click', () => this.showWelcome());
    this.elements.genreSelect.addEventListener('change', () => this.applyView());
    this.elements.sortSelect.addEventListener('change', () => this.applyView());
    this.elements.viewSelect.addEventListener('change', () => this.applyView());
    this.elements.favoritesBtn.addEventListener('click', () => this.toggleFavoritesMode());
    this.elements.loadMoreBtn.addEventListener('click', () => this.loadMore());
    this.elements.results.addEventListener('click', (event) => this.handleResultsClick(event));
    this.elements.modal.addEventListener('click', (event) => this.handleModalClick(event));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !this.elements.modal.classList.contains('hidden')) {
        this.closeModal();
      }
    });

    this.elements.searchInput.addEventListener(
      'input',
      debounce(() => {
        if (this.elements.searchInput.value.trim().length >= 3) {
          this.startSearch();
        }
      }, 700)
    );
  }

  handleWelcomeSubmit(event) {
    event.preventDefault();

    const name = this.elements.userName.value.trim();

    if (!name) {
      this.showMessage('Введите имя, чтобы продолжить.', 'error');
      return;
    }

    this.storage.saveUserName(name);
    this.state.userName = name;
    this.showApp();
    this.loadInitialMovies();
  }

  showWelcome() {
    this.elements.welcomeScreen.classList.remove('hidden');
    this.elements.appScreen.classList.add('hidden');
    this.elements.userName.focus();
  }

  showApp() {
    this.elements.welcomeScreen.classList.add('hidden');
    this.elements.appScreen.classList.remove('hidden');
    this.elements.greeting.textContent = `Добро пожаловать в кинотеатр, ${this.state.userName}!`;
    this.elements.headerHint.textContent = `Привет, ${this.state.userName}! Используйте поиск, сортировку, фильтры и избранное.`;
  }

  async loadInitialMovies() {
    this.elements.searchInput.value = DEFAULT_SEARCH;
    this.elements.typeSelect.value = DEFAULT_TYPE;
    await this.startSearch();
  }

  async handleSearchSubmit(event) {
    event.preventDefault();
    await this.startSearch();
  }

  async startSearch() {
    const query = this.elements.searchInput.value.trim();

    if (query.length < 3) {
      this.showMessage('Введите минимум 3 символа для поиска.', 'error');
      return;
    }

    this.state.currentQuery = query;
    this.state.currentType = this.elements.typeSelect.value;
    this.state.currentPage = 1;
    this.state.movies = [];
    this.state.totalResults = 0;
    this.state.favoritesMode = false;
    this.updateFavoritesButton();

    await this.loadMoviesPage(false);
  }

  async loadMoviesPage(append) {
    if (this.state.isLoading) {
      return;
    }

    this.setLoading(true);

    if (!append) {
      this.renderer.renderLoader('Ищем фильмы и сериалы...');
    }

    try {
      const data = await this.api.searchMoviesWithDetails(
        this.state.currentQuery,
        this.state.currentType,
        this.state.currentPage
      );

      this.state.totalResults = data.totalResults;
      this.state.movies = append ? [...this.state.movies, ...data.movies] : data.movies;

      this.updateGenreOptions();
      this.applyView();

      if (data.source && data.source !== 'OMDb API') {
        this.showMessage(`Данные загружены через запасной источник: ${data.source}. Сайт работает без VPN.`, 'success');
      } else {
        this.hideMessage();
      }
    } catch (error) {
      if (append) {
        this.showMessage(`Не удалось загрузить следующую страницу: ${error.message}`, 'error');
      } else {
        const fallbackMovies = getFallbackMovies(this.state.currentQuery, this.state.currentType);
        this.state.movies = fallbackMovies;
        this.state.totalResults = fallbackMovies.length;
        this.updateGenreOptions();
        this.applyView();
        this.showMessage(
          `Внешние API сейчас недоступны. Показан встроенный каталог, поэтому сайт продолжает работать без VPN. Техническая ошибка: ${error.message}`,
          'warning'
        );
      }
    } finally {
      this.setLoading(false);
    }
  }

  async loadMore() {
    const loadedCount = this.state.movies.length;

    if (loadedCount >= this.state.totalResults) {
      return;
    }

    this.state.currentPage += 1;
    await this.loadMoviesPage(true);
  }

  setLoading(value) {
    this.state.isLoading = value;
    this.elements.loadMoreBtn.disabled = value;

    if (value) {
      this.elements.loadMoreBtn.textContent = 'Загрузка...';
    } else {
      this.elements.loadMoreBtn.textContent = 'Загрузить ещё';
    }
  }

  getActiveMovies() {
    const movies = this.state.favoritesMode ? this.storage.getFavorites() : this.state.movies;
    const filtered = filterByGenre(movies, this.elements.genreSelect.value);
    return sortMovies(filtered, this.elements.sortSelect.value);
  }

  applyView() {
    const movies = this.getActiveMovies();
    const favoriteIds = this.storage.getFavorites().map((movie) => movie.id);

    this.renderer.renderMovies(movies, this.elements.viewSelect.value, favoriteIds);
    this.updateStats(movies);
    this.updateLoadMoreButton();
  }

  updateStats(movies) {
    const avg = averageRating(movies);

    this.elements.totalCount.textContent = movies.length;
    this.elements.favoriteCount.textContent = this.storage.getFavorites().length;
    this.elements.averageRating.textContent = avg === null ? '—' : avg.toFixed(1);
  }

  updateGenreOptions() {
    const activeBase = this.state.favoritesMode ? this.storage.getFavorites() : this.state.movies;
    const currentGenre = this.elements.genreSelect.value;
    const genres = uniqueGenres(activeBase);

    this.elements.genreSelect.innerHTML = '<option value="">Все жанры</option>';

    genres.forEach((genre) => {
      const option = document.createElement('option');
      option.value = genre;
      option.textContent = genre;
      this.elements.genreSelect.append(option);
    });

    if (genres.includes(currentGenre)) {
      this.elements.genreSelect.value = currentGenre;
    }
  }

  updateLoadMoreButton() {
    const canLoadMore = !this.state.favoritesMode
      && this.state.movies.length > 0
      && this.state.movies.length < this.state.totalResults;

    this.elements.loadMoreBtn.classList.toggle('hidden', !canLoadMore);
  }

  toggleFavoritesMode() {
    this.state.favoritesMode = !this.state.favoritesMode;
    this.updateFavoritesButton();
    this.updateGenreOptions();
    this.applyView();

    if (this.state.favoritesMode) {
      this.showMessage('Открыт раздел избранных фильмов и сериалов.', 'success');
    } else {
      this.hideMessage();
    }
  }

  updateFavoritesButton() {
    this.elements.favoritesBtn.textContent = this.state.favoritesMode
      ? 'Вернуться к поиску'
      : 'Показать избранное';
  }

  handleResultsClick(event) {
    const button = event.target.closest('[data-action]');
    const card = event.target.closest('[data-id]');

    if (!button || !card) {
      return;
    }

    const movie = this.findMovie(card.dataset.id);

    if (!movie) {
      return;
    }

    const action = button.dataset.action;

    if (action === 'favorite') {
      this.toggleFavorite(movie);
      return;
    }

    if (action === 'details') {
      this.openModal(movie);
    }
  }

  handleModalClick(event) {
    const actionElement = event.target.closest('[data-action]');

    if (!actionElement) {
      return;
    }

    const action = actionElement.dataset.action;

    if (action === 'close-modal') {
      this.closeModal();
      return;
    }

    if (action === 'favorite-modal') {
      const container = event.target.closest('[data-id]');
      const movie = this.findMovie(container.dataset.id);

      if (movie) {
        this.toggleFavorite(movie);
        this.renderer.renderModal(movie, this.storage.isFavorite(movie.id));
      }
    }
  }

  findMovie(movieId) {
    const fromCurrent = this.state.movies.find((movie) => movie.id === movieId);

    if (fromCurrent) {
      return fromCurrent;
    }

    return this.storage.getFavorites().find((movie) => movie.id === movieId);
  }

  toggleFavorite(movie) {
    const added = this.storage.toggleFavorite(movie);
    this.applyView();

    if (this.elements.modal.classList.contains('hidden')) {
      this.showMessage(
        added ? 'Добавлено в избранное.' : 'Удалено из избранного.',
        added ? 'success' : ''
      );
    }
  }

  openModal(movie) {
    this.renderer.renderModal(movie, this.storage.isFavorite(movie.id));
    this.elements.modal.classList.remove('hidden');
    this.elements.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.elements.modal.classList.add('hidden');
    this.elements.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  showMessage(text, type = '') {
    this.elements.message.textContent = text;
    this.elements.message.className = `message ${type}`.trim();
    this.elements.message.classList.remove('hidden');
  }

  hideMessage() {
    this.elements.message.textContent = '';
    this.elements.message.className = 'message hidden';
  }
}

const app = new KinozalApp();
app.init();
