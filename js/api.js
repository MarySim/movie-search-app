import {
  API_KEY,
  API_URL,
  OMDB_PROXY_URLS,
  REQUEST_TIMEOUT,
  TVMAZE_API_URL
} from './config.js';
import { Movie } from './movie.js';

export class MovieApi {
  constructor() {
    this.cache = new Map();
    this.lastErrors = [];
  }

  buildOmdbUrl(params) {
    const url = new URL(API_URL);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });

    url.searchParams.set('apikey', API_KEY);
    return url;
  }

  buildProxyUrl(originalUrl, proxyIndex = 0) {
    const proxy = OMDB_PROXY_URLS[proxyIndex];
    return `${proxy}${encodeURIComponent(originalUrl.toString())}`;
  }

  async fetchJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async requestOmdb(params, proxyIndex = null) {
    const originalUrl = this.buildOmdbUrl(params);
    const url = proxyIndex === null ? originalUrl : this.buildProxyUrl(originalUrl, proxyIndex);
    const data = await this.fetchJson(url);

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Данные не найдены');
    }

    return data;
  }

  async requestOmdbWithFallback(params) {
    try {
      return {
        data: await this.requestOmdb(params),
        source: 'OMDb API'
      };
    } catch (error) {
      this.lastErrors.push(`OMDb напрямую: ${error.message}`);
    }

    for (let i = 0; i < OMDB_PROXY_URLS.length; i += 1) {
      try {
        return {
          data: await this.requestOmdb(params, i),
          source: 'OMDb API через прокси'
        };
      } catch (error) {
        this.lastErrors.push(`OMDb через прокси ${i + 1}: ${error.message}`);
      }
    }

    throw new Error(this.lastErrors.join('; '));
  }

  async searchOmdbMovies(query, type = '', page = 1) {
    const result = await this.requestOmdbWithFallback({
      s: query,
      type,
      page
    });

    return {
      source: result.source,
      totalResults: Number.parseInt(result.data.totalResults || '0', 10),
      items: result.data.Search || []
    };
  }

  async getOmdbMovieDetails(imdbId) {
    if (this.cache.has(imdbId)) {
      return this.cache.get(imdbId);
    }

    const result = await this.requestOmdbWithFallback({
      i: imdbId,
      plot: 'full'
    });

    const movie = Movie.fromOmdb(result.data);
    this.cache.set(imdbId, movie);
    return movie;
  }

  async searchOmdbWithDetails(query, type = '', page = 1) {
    const searchData = await this.searchOmdbMovies(query, type, page);

    const detailedMovies = await Promise.all(
      searchData.items.map(async (item) => {
        try {
          return await this.getOmdbMovieDetails(item.imdbID);
        } catch {
          return Movie.fromOmdb(item);
        }
      })
    );

    return {
      source: searchData.source,
      totalResults: searchData.totalResults,
      movies: detailedMovies
    };
  }

  async searchTvMaze(query, type = '') {
    if (type === 'movie') {
      throw new Error('TVMaze содержит в основном сериалы, выбран фильтр «Фильмы».');
    }

    const url = new URL(TVMAZE_API_URL);
    url.searchParams.set('q', query);

    const data = await this.fetchJson(url);
    const movies = data
      .map((item) => Movie.fromTvMaze(item))
      .filter((movie) => !type || movie.type === type);

    if (!movies.length) {
      throw new Error('TVMaze не нашёл подходящие сериалы.');
    }

    return {
      source: 'TVMaze API',
      totalResults: movies.length,
      movies
    };
  }

  async searchMoviesWithDetails(query, type = '', page = 1) {
    this.lastErrors = [];

    try {
      return await this.searchOmdbWithDetails(query, type, page);
    } catch (error) {
      this.lastErrors.push(`OMDb недоступен: ${error.message}`);
    }

    try {
      return await this.searchTvMaze(query, type);
    } catch (error) {
      this.lastErrors.push(`TVMaze недоступен: ${error.message}`);
    }

    throw new Error(this.lastErrors.join('; '));
  }
}
