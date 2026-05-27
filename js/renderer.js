import { escapeHtml } from './utils.js';

export class MovieRenderer {
  constructor(resultsElement, modalBodyElement) {
    this.resultsElement = resultsElement;
    this.modalBodyElement = modalBodyElement;
  }

  renderMovies(movies, viewType, favoriteIds) {
    this.resultsElement.className = `results ${viewType === 'list' ? 'list-view' : 'cards-view'}`;

    if (!movies.length) {
      this.resultsElement.innerHTML = this.renderEmptyState();
      return;
    }

    this.resultsElement.innerHTML = movies
      .map((movie) => {
        const isFavorite = favoriteIds.includes(movie.id);
        return viewType === 'list'
          ? this.renderMovieRow(movie, isFavorite)
          : this.renderMovieCard(movie, isFavorite);
      })
      .join('');
  }

  renderEmptyState() {
    return `
      <div class="empty-state">
        <div>
          <h2>Пока ничего не найдено</h2>
          <p>Введите название фильма или сериала, измените фильтр или откройте избранное.</p>
        </div>
      </div>
    `;
  }

  renderPoster(movie, className = '') {
    if (movie.hasPoster()) {
      return `<img src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)}" loading="lazy" onerror="this.onerror=null; this.outerHTML='<div class=&quot;poster-placeholder&quot;>Постер недоступен</div>';" />`;
    }

    return `<div class="poster-placeholder ${className}">Постер отсутствует</div>`;
  }

  renderGenrePills(movie, limit = 3) {
    const genres = movie.genre.slice(0, limit);

    if (!genres.length) {
      return '<span class="genre-pill">Без жанра</span>';
    }

    return genres.map((genre) => `<span class="genre-pill">${escapeHtml(genre)}</span>`).join('');
  }

  renderMovieCard(movie, isFavorite) {
    const favoriteClass = isFavorite ? 'favorite-active' : '';
    const favoriteText = isFavorite ? 'В избранном' : 'В избранное';

    return `
      <article class="movie-card" data-id="${escapeHtml(movie.id)}">
        <div class="poster-wrap" data-action="details">
          ${this.renderPoster(movie)}
          <span class="rating-badge">${escapeHtml(movie.getRatingLabel())}</span>
        </div>
        <div class="movie-info">
          <h2 class="movie-title">${escapeHtml(movie.title)}</h2>
          <div class="movie-meta">
            <span>${escapeHtml(movie.year)}</span>
            <span>•</span>
            <span>${escapeHtml(movie.getTypeLabel())}</span>
          </div>
          <div class="genre-row">${this.renderGenrePills(movie)}</div>
          <div class="card-actions">
            <button class="small-btn ${favoriteClass}" type="button" data-action="favorite">
              ${favoriteText}
            </button>
            <button class="small-btn" type="button" data-action="details">Подробнее</button>
          </div>
        </div>
      </article>
    `;
  }

  renderMovieRow(movie, isFavorite) {
    const favoriteClass = isFavorite ? 'favorite-active' : '';
    const favoriteText = isFavorite ? 'В избранном' : 'В избранное';

    return `
      <article class="movie-row" data-id="${escapeHtml(movie.id)}">
        <div class="row-poster" data-action="details">${this.renderPoster(movie)}</div>
        <div>
          <h2 class="movie-title">${escapeHtml(movie.title)}</h2>
          <div class="movie-meta">
            <span>${escapeHtml(movie.year)}</span>
            <span>•</span>
            <span>${escapeHtml(movie.getTypeLabel())}</span>
            <span>•</span>
            <span>IMDb: ${escapeHtml(movie.getRatingLabel())}</span>
          </div>
          <p>${escapeHtml(movie.getGenreLabel())}</p>
        </div>
        <div class="row-actions">
          <button class="small-btn ${favoriteClass}" type="button" data-action="favorite">${favoriteText}</button>
          <button class="small-btn" type="button" data-action="details">Подробнее</button>
        </div>
      </article>
    `;
  }

  renderModal(movie, isFavorite) {
    const favoriteText = isFavorite ? 'Удалить из избранного' : 'В избранное';
    const favoriteClass = isFavorite ? 'favorite-active' : '';

    this.modalBodyElement.innerHTML = `
      <div class="modal-grid" data-id="${escapeHtml(movie.id)}">
        <div class="modal-poster">
          ${this.renderPoster(movie)}
        </div>

        <div class="modal-details">
          <p class="eyebrow">${escapeHtml(movie.getTypeLabel())}</p>
          <h2 id="modalTitle">${escapeHtml(movie.title)}</h2>

          <div class="genre-row">${this.renderGenrePills(movie, 8)}</div>

          <div class="detail-grid">
            <div class="detail-item">
              <span>Год</span>
              <strong>${escapeHtml(movie.year)}</strong>
            </div>
            <div class="detail-item">
              <span>Рейтинг IMDb</span>
              <strong>${escapeHtml(movie.getRatingLabel())}</strong>
            </div>
            <div class="detail-item">
              <span>Дата выхода</span>
              <strong>${escapeHtml(movie.released)}</strong>
            </div>
            <div class="detail-item">
              <span>Длительность</span>
              <strong>${escapeHtml(movie.runtime)}</strong>
            </div>
            <div class="detail-item">
              <span>Страна</span>
              <strong>${escapeHtml(movie.country)}</strong>
            </div>
            <div class="detail-item">
              <span>Язык</span>
              <strong>${escapeHtml(movie.language)}</strong>
            </div>
          </div>

          <p><strong>Режиссёр:</strong> ${escapeHtml(movie.director)}</p>
          <p><strong>Актёры:</strong> ${escapeHtml(movie.actors)}</p>
          <p><strong>Описание:</strong> ${escapeHtml(movie.plot)}</p>
          <p><strong>Награды:</strong> ${escapeHtml(movie.awards)}</p>

          <button class="small-btn ${favoriteClass}" type="button" data-action="favorite-modal">
            ${favoriteText}
          </button>
        </div>
      </div>
    `;
  }

  renderLoader(text = 'Загрузка данных...') {
    this.resultsElement.innerHTML = `<div class="empty-state"><span class="loader">${escapeHtml(text)}</span></div>`;
  }
}
