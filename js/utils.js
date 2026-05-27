export function uniqueGenres(movies) {
  const genres = new Set();

  movies.forEach((movie) => {
    movie.genre.forEach((genre) => genres.add(genre));
  });

  return [...genres].sort((a, b) => a.localeCompare(b, 'ru'));
}

export function averageRating(movies) {
  const ratings = movies
    .map((movie) => movie.rating)
    .filter((rating) => rating !== null);

  if (!ratings.length) {
    return null;
  }

  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / ratings.length;
}

export function sortMovies(movies, sortType) {
  const copy = [...movies];

  const sorters = {
    'rating-desc': (a, b) => (b.rating ?? -1) - (a.rating ?? -1),
    'rating-asc': (a, b) => (a.rating ?? 99) - (b.rating ?? 99),
    'date-desc': (a, b) => b.getReleaseDateValue() - a.getReleaseDateValue(),
    'date-asc': (a, b) => a.getReleaseDateValue() - b.getReleaseDateValue(),
    'title-asc': (a, b) => a.title.localeCompare(b.title, 'ru')
  };

  if (!sorters[sortType]) {
    return copy;
  }

  return copy.sort(sorters[sortType]);
}

export function filterByGenre(movies, genre) {
  if (!genre) {
    return movies;
  }

  return movies.filter((movie) => movie.genre.includes(genre));
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function debounce(callback, delay = 400) {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}
