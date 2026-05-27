import { Movie } from './movie.js';

const FALLBACK_DATA = [
  {
    id: 'tt0372784',
    title: 'Batman Begins',
    year: '2005',
    type: 'movie',
    poster: 'https://m.media-amazon.com/images/M/MV5BOTY4YjZhNzMtYzU5Yy00NzM5LTljYmMtNmIwM2JjYjQ3YTAxXkEyXkFqcGc@._V1_SX300.jpg',
    genre: 'Action, Crime, Drama',
    rating: '8.2',
    released: '15 Jun 2005',
    runtime: '140 min',
    director: 'Christopher Nolan',
    actors: 'Christian Bale, Michael Caine, Ken Watanabe',
    country: 'United States, United Kingdom',
    plot: 'After training with his mentor, Batman begins his fight to free crime-ridden Gotham City from corruption.',
    awards: 'Nominated for 1 Oscar. 14 wins & 79 nominations total',
    language: 'English'
  },
  {
    id: 'tt0468569',
    title: 'The Dark Knight',
    year: '2008',
    type: 'movie',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    genre: 'Action, Crime, Drama',
    rating: '9.0',
    released: '18 Jul 2008',
    runtime: '152 min',
    director: 'Christopher Nolan',
    actors: 'Christian Bale, Heath Ledger, Aaron Eckhart',
    country: 'United States, United Kingdom',
    plot: 'Batman faces the Joker, a criminal mastermind who brings chaos to Gotham.',
    awards: 'Won 2 Oscars. 164 wins & 165 nominations total',
    language: 'English'
  },
  {
    id: 'tt0848228',
    title: 'The Avengers',
    year: '2012',
    type: 'movie',
    poster: 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTc0MC00Y2NjLWE4ZWYtMjFhYjY1YzFkODg2XkEyXkFqcGc@._V1_SX300.jpg',
    genre: 'Action, Sci-Fi, Adventure',
    rating: '8.0',
    released: '04 May 2012',
    runtime: '143 min',
    director: 'Joss Whedon',
    actors: 'Robert Downey Jr., Chris Evans, Scarlett Johansson',
    country: 'United States',
    plot: 'Earth’s mightiest heroes must learn to fight as a team to stop Loki and his alien army.',
    awards: 'Nominated for 1 Oscar. 39 wins & 81 nominations total',
    language: 'English'
  },
  {
    id: 'tt4154796',
    title: 'Avengers: Endgame',
    year: '2019',
    type: 'movie',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDU5MjE2Nl5BMl5BanBnXkFtZTgwOTc4NTc3NzM@._V1_SX300.jpg',
    genre: 'Action, Adventure, Drama',
    rating: '8.4',
    released: '26 Apr 2019',
    runtime: '181 min',
    director: 'Anthony Russo, Joe Russo',
    actors: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
    country: 'United States',
    plot: 'The Avengers assemble once more to reverse Thanos’ actions and restore balance.',
    awards: 'Nominated for 1 Oscar. 70 wins & 133 nominations total',
    language: 'English'
  },
  {
    id: 'tt0903747',
    title: 'Breaking Bad',
    year: '2008–2013',
    type: 'series',
    poster: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYzktM2Q0YS00ZGVjLWJhYzQtMWQ2NGQwZjliZDI0XkEyXkFqcGc@._V1_SX300.jpg',
    genre: 'Crime, Drama, Thriller',
    rating: '9.5',
    released: '20 Jan 2008',
    runtime: '49 min',
    director: '—',
    actors: 'Bryan Cranston, Aaron Paul, Anna Gunn',
    country: 'United States',
    plot: 'A chemistry teacher turns to manufacturing methamphetamine after a terminal diagnosis.',
    awards: 'Won 16 Primetime Emmys. 171 wins & 247 nominations total',
    language: 'English, Spanish'
  },
  {
    id: 'tt0944947',
    title: 'Game of Thrones',
    year: '2011–2019',
    type: 'series',
    poster: 'https://m.media-amazon.com/images/M/MV5BYTRiNDgzNzctN2YxMi00ZjBlLWE5YmMtNzUzMWQwOWVlNGNjXkEyXkFqcGc@._V1_SX300.jpg',
    genre: 'Action, Adventure, Drama',
    rating: '9.2',
    released: '17 Apr 2011',
    runtime: '57 min',
    director: '—',
    actors: 'Emilia Clarke, Peter Dinklage, Kit Harington',
    country: 'United States, United Kingdom',
    plot: 'Noble families fight for control of the Iron Throne in a fantasy world.',
    awards: 'Won 59 Primetime Emmys. 397 wins & 655 nominations total',
    language: 'English'
  },
  {
    id: 'tt2861424',
    title: 'Rick and Morty',
    year: '2013–',
    type: 'series',
    poster: 'https://m.media-amazon.com/images/M/MV5BZjRjN2Y1ODQtY2YyYy00NWM2LWE5YjMtNmExMzA0NjkzZDRiXkEyXkFqcGc@._V1_SX300.jpg',
    genre: 'Animation, Adventure, Comedy',
    rating: '9.1',
    released: '02 Dec 2013',
    runtime: '23 min',
    director: '—',
    actors: 'Chris Parnell, Spencer Grammer, Sarah Chalke',
    country: 'United States',
    plot: 'An eccentric scientist and his grandson travel across dimensions and strange worlds.',
    awards: 'Won 2 Primetime Emmys. 21 wins & 40 nominations total',
    language: 'English'
  },
  {
    id: 'tt0111161',
    title: 'The Shawshank Redemption',
    year: '1994',
    type: 'movie',
    poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGc@._V1_SX300.jpg',
    genre: 'Drama',
    rating: '9.3',
    released: '14 Oct 1994',
    runtime: '142 min',
    director: 'Frank Darabont',
    actors: 'Tim Robbins, Morgan Freeman, Bob Gunton',
    country: 'United States',
    plot: 'Two imprisoned men bond over many years, finding solace and eventual redemption.',
    awards: 'Nominated for 7 Oscars. 21 wins & 43 nominations total',
    language: 'English'
  },
  {
    id: 'tt1375666',
    title: 'Inception',
    year: '2010',
    type: 'movie',
    poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxMl5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    genre: 'Action, Adventure, Sci-Fi',
    rating: '8.8',
    released: '16 Jul 2010',
    runtime: '148 min',
    director: 'Christopher Nolan',
    actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
    country: 'United States, United Kingdom',
    plot: 'A thief who steals corporate secrets through dream-sharing is given an impossible task.',
    awards: 'Won 4 Oscars. 159 wins & 220 nominations total',
    language: 'English, Japanese, French'
  },
  {
    id: 'tt0133093',
    title: 'The Matrix',
    year: '1999',
    type: 'movie',
    poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3MjAtNDM5Mi00YzZhLTk3NzYtMzY1NDMwZjg5ZDUyXkEyXkFqcGc@._V1_SX300.jpg',
    genre: 'Action, Sci-Fi',
    rating: '8.7',
    released: '31 Mar 1999',
    runtime: '136 min',
    director: 'Lana Wachowski, Lilly Wachowski',
    actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
    country: 'United States, Australia',
    plot: 'A hacker discovers that reality is a simulated world controlled by machines.',
    awards: 'Won 4 Oscars. 42 wins & 52 nominations total',
    language: 'English'
  },
  {
    id: 'tt0120737',
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: '2001',
    type: 'movie',
    poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzAtM2ZkZi00ZGE4LWJjYjgtNmM1MTg1YjIxY2Q1XkEyXkFqcGc@._V1_SX300.jpg',
    genre: 'Adventure, Drama, Fantasy',
    rating: '8.9',
    released: '19 Dec 2001',
    runtime: '178 min',
    director: 'Peter Jackson',
    actors: 'Elijah Wood, Ian McKellen, Orlando Bloom',
    country: 'New Zealand, United States',
    plot: 'A meek Hobbit and eight companions set out to destroy the One Ring.',
    awards: 'Won 4 Oscars. 125 wins & 127 nominations total',
    language: 'English, Sindarin'
  },
  {
    id: 'tt0108778',
    title: 'Friends',
    year: '1994–2004',
    type: 'series',
    poster: 'https://m.media-amazon.com/images/M/MV5BOTU2YmM5ZjctOGVlMC00YTczLTljM2MtYjhlNGI5YWMyZjFkXkEyXkFqcGc@._V1_SX300.jpg',
    genre: 'Comedy, Romance',
    rating: '8.9',
    released: '22 Sep 1994',
    runtime: '22 min',
    director: '—',
    actors: 'Jennifer Aniston, Courteney Cox, Lisa Kudrow',
    country: 'United States',
    plot: 'Six friends in Manhattan navigate work, love, and everyday life.',
    awards: 'Won 6 Primetime Emmys. 81 wins & 231 nominations total',
    language: 'English'
  }
];

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function matches(movie, query, type) {
  const search = normalize(query);
  const fields = [
    movie.title,
    movie.year,
    movie.type,
    movie.genre,
    movie.director,
    movie.actors,
    movie.plot
  ].join(' ').toLowerCase();

  const typeMatches = !type || movie.type === type;
  const queryMatches = !search || fields.includes(search);

  return typeMatches && queryMatches;
}

export function getFallbackMovies(query = '', type = '') {
  const found = FALLBACK_DATA.filter((movie) => matches(movie, query, type));
  const source = found.length ? found : FALLBACK_DATA.filter((movie) => !type || movie.type === type);

  return source.map((item) => new Movie(item));
}
