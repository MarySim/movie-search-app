export class View {
    constructor() {
        // Кэшируем все элементы DOM, с которыми будем работать
        // Страница приветствия
        this.welcomePage = document.getElementById('welcome-page');
        this.usernameInput = document.getElementById('username-input');
        this.welcomeButton = document.getElementById('welcome-button');
        this.welcomeError = document.getElementById('welcome-error');

        // Главная страница
        this.mainPage = document.getElementById('main-page');
        this.greeting = document.getElementById('greeting');
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.typeSelect = document.getElementById('type-select');
        this.sortButtons = document.querySelectorAll('.sort-button');
        this.posterFilter = document.getElementById('poster-filter');
        this.statsButton = document.getElementById('stats-button');

        // Контейнеры для контента
        this.messageContainer = document.getElementById('message-container');
        this.moviesContainer = document.getElementById('movies-container');
        this.statsContainer = document.getElementById('stats-container');
        this.statsContent = document.getElementById('stats-content');

        // Модальное окно
        this.modal = document.getElementById('modal');
        this.modalBody = document.getElementById('modal-body');
        this.modalClose = document.querySelector('.modal-close');
    }

    // ===== СТРАНИЦА ПРИВЕТСТВИЯ =====

    showWelcomeError(message) {
        this.welcomeError.textContent = message;
    }

    hideWelcomeError() {
        this.welcomeError.textContent = '';
    }

    getUsername() {
        return this.usernameInput.value.trim();
    }

    showMainPage() {
        this.welcomePage.classList.add('hidden');
        this.mainPage.classList.remove('hidden');
    }

    // ===== ШАПКА =====

    updateGreeting(name) {
        this.greeting.textContent = `Привет, ${name}!`;
    }

    // ===== СООБЩЕНИЯ =====

    showMessage(text, type = 'info') {
        this.messageContainer.innerHTML = `
            <div class="message message-${type}">
                <p>${text}</p>
            </div>
        `;
    }

    showLoader() {
        this.messageContainer.innerHTML = `
            <div class="loader"></div>
            <p class="loading-text">Загрузка...</p>
        `;
    }

    clearMessages() {
        this.messageContainer.innerHTML = '';
    }

    // ===== ОТРИСОВКА ФИЛЬМОВ =====

    renderMovies(movies) {
        this.moviesContainer.innerHTML = '';

        if (!movies || movies.length === 0) {
            this.showMessage('Ничего не найдено. Попробуйте изменить запрос.', 'warning');
            return;
        }

        const grid = document.createElement('div');
        grid.classList.add('movies-grid');

        movies.forEach(movie => {
            const card = this.createMovieCard(movie);
            grid.appendChild(card);
        });

        this.moviesContainer.appendChild(grid);
    }

    createMovieCard(movie) {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.dataset.id = movie.imdbID;

        const posterUrl = (movie.Poster && movie.Poster !== 'N/A') 
            ? movie.Poster 
            : 'https://via.placeholder.com/300x450?text=Нет+постера';

        card.innerHTML = `
            <img class="movie-poster" src="${posterUrl}" alt="${movie.Title}">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <span class="movie-year">${movie.Year}</span>
                <span class="movie-type">${this.translateType(movie.Type)}</span>
            </div>
            <button class="movie-detail-button">Подробнее</button>
        `;

        return card;
    }

    translateType(type) {
        const types = {
            'movie': 'Фильм',
            'series': 'Сериал',
            'episode': 'Эпизод',
            'game': 'Игра'
        };
        return types[type] || type;
    }

    // ===== СТАТИСТИКА =====

    renderStats(stats) {
        if (!stats) {
            this.statsContainer.classList.add('hidden');
            return;
        }

        this.statsContainer.classList.remove('hidden');
        this.statsContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-value">${stats.total}</span>
                    <span class="stat-label">Всего найдено</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.withPoster}</span>
                    <span class="stat-label">С постерами</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.oldestYear || '—'}</span>
                    <span class="stat-label">Самый старый фильм (год)</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.newestYear || '—'}</span>
                    <span class="stat-label">Самый новый фильм (год)</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.averageYear || '—'}</span>
                    <span class="stat-label">Средний год выпуска</span>
                </div>
            </div>
        `;
    }

    // ===== МОДАЛЬНОЕ ОКНО =====

    openModal(movie) {
        this.modalBody.innerHTML = `
            <div class="modal-layout">
                <img class="modal-poster" src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=Нет+постера'}" alt="${movie.Title}">
                <div class="modal-details">
                    <h2>${movie.Title}</h2>
                    <p><strong>Год:</strong> ${movie.Year}</p>
                    <p><strong>Рейтинг:</strong> ${movie.imdbRating} / 10 (${movie.imdbVotes} голосов)</p>
                    <p><strong>Жанр:</strong> ${movie.Genre}</p>
                    <p><strong>Продолжительность:</strong> ${movie.Runtime}</p>
                    <p><strong>Режиссёр:</strong> ${movie.Director}</p>
                    <p><strong>Актёры:</strong> ${movie.Actors}</p>
                    <p><strong>Сюжет:</strong> ${movie.Plot}</p>
                </div>
            </div>
        `;

        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // запрещаем скролл фона
    }

    closeModal() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // ===== БИНДИНГ СОБЫТИЙ =====

    bindWelcomeSubmit(handler) {
        this.welcomeButton.addEventListener('click', handler);
        this.usernameInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handler();
            }
        });
    }

    bindSearch(handler) {
        this.searchButton.addEventListener('click', handler);
        this.searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handler();
            }
        });
    }

    bindTypeChange(handler) {
        this.typeSelect.addEventListener('change', handler);
    }

    bindSort(handler) {
        this.sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс со всех кнопок сортировки
                this.sortButtons.forEach(b => b.classList.remove('active'));
                // Добавляем активный класс на нажатую
                button.classList.add('active');

                const sortType = button.dataset.sort;
                handler(sortType);
            });
        });
    }

    bindPosterFilter(handler) {
        this.posterFilter.addEventListener('change', () => {
            handler(this.posterFilter.checked);
        });
    }

    bindStatsButton(handler) {
        this.statsButton.addEventListener('click', handler);
    }

    bindMovieClick(handler) {
        this.moviesContainer.addEventListener('click', (event) => {
            const card = event.target.closest('.movie-card');
            const detailButton = event.target.closest('.movie-detail-button');

            if (card && detailButton) {
                const movieId = card.dataset.id;
                handler(movieId);
            }
        });
    }

    bindModalClose() {
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    getSearchQuery() {
        return this.searchInput.value.trim();
    }

    getSelectedType() {
        return this.typeSelect.value;
    }
}