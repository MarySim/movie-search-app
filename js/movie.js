export class Movie {
  constructor(data) {
    this.id = data.id;
    this.title = data.title || 'Без названия';
    this.year = data.year || '—';
    this.type = data.type || 'movie';
    this.poster = data.poster || 'N/A';
    this.genre = Array.isArray(data.genre) ? data.genre : this.splitGenre(data.genre);
    this.rating = this.prepareRating(data.rating);
    this.released = data.released || '—';
    this.runtime = data.runtime || '—';
    this.director = data.director || '—';
    this.actors = data.actors || '—';
    this.country = data.country || '—';
    this.plot = data.plot || 'Описание отсутствует.';
    this.awards = data.awards || '—';
    this.language = data.language || '—';
  }

  static fromOmdb(item) {
    return new Movie({
      id: item.imdbID,
      title: item.Title,
      year: item.Year,
      type: item.Type,
      poster: item.Poster,
      genre: item.Genre,
      rating: item.imdbRating,
      released: item.Released,
      runtime: item.Runtime,
      director: item.Director,
      actors: item.Actors,
      country: item.Country,
      plot: item.Plot,
      awards: item.Awards,
      language: item.Language
    });
  }


  static fromTvMaze(item) {
    const show = item.show || item;
    const image = show.image?.medium || show.image?.original || 'N/A';
    const rating = show.rating?.average ? String(show.rating.average) : null;
    const cleanSummary = show.summary
      ? show.summary.replace(/<[^>]*>/g, '').trim()
      : 'Описание отсутствует.';

    return new Movie({
      id: `tvmaze-${show.id}`,
      title: show.name,
      year: show.premiered ? show.premiered.slice(0, 4) : '—',
      type: 'series',
      poster: image,
      genre: show.genres || [],
      rating,
      released: show.premiered || '—',
      runtime: show.runtime ? `${show.runtime} min` : '—',
      director: show.network?.name || show.webChannel?.name || '—',
      actors: '—',
      country: show.network?.country?.name || show.webChannel?.country?.name || '—',
      plot: cleanSummary,
      awards: '—',
      language: show.language || '—'
    });
  }

  static fromStorage(item) {
    return new Movie(item);
  }

  splitGenre(value) {
    if (!value || value === 'N/A') {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return String(value)
      .split(',')
      .map((genre) => genre.trim())
      .filter(Boolean);
  }

  prepareRating(value) {
    const number = Number.parseFloat(value);

    if (Number.isNaN(number)) {
      return null;
    }

    return number;
  }

  hasPoster() {
    return this.poster && this.poster !== 'N/A';
  }

  getRatingLabel() {
    return this.rating === null ? '—' : this.rating.toFixed(1);
  }

  getGenreLabel() {
    return this.genre.length ? this.genre.join(', ') : 'Жанр не указан';
  }

  getTypeLabel() {
    const labels = {
      movie: 'Фильм',
      series: 'Сериал',
      episode: 'Эпизод',
      game: 'Игра'
    };

    return labels[this.type] || this.type;
  }

  getReleaseDateValue() {
    if (!this.released || this.released === 'N/A' || this.released === '—') {
      const year = Number.parseInt(this.year, 10);
      return Number.isNaN(year) ? 0 : new Date(year, 0, 1).getTime();
    }

    const parsed = Date.parse(this.released);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  toPlainObject() {
    return {
      id: this.id,
      title: this.title,
      year: this.year,
      type: this.type,
      poster: this.poster,
      genre: this.genre,
      rating: this.rating,
      released: this.released,
      runtime: this.runtime,
      director: this.director,
      actors: this.actors,
      country: this.country,
      plot: this.plot,
      awards: this.awards,
      language: this.language
    };
  }
}
