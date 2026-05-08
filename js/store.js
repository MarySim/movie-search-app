export class Store {
    constructor() {
        this.movies = [];
        this.currentSort = 'none';
        this.filterPoster = false;
    }

    setMovies(movies) {
        this.movies = movies || [];
    }

    getMovies() {
        let result = [...this.movies];

        if (this.filterPoster) {
            result = result.filter(movie => movie.Poster && movie.Poster !== 'N/A');
        }

        switch (this.currentSort) {
            case 'year-asc':
                result.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
                break;
            case 'year-desc':
                result.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
                break;
            case 'title':
                result.sort((a, b) => a.Title.localeCompare(b.Title));
                break;
        }

        return result;
    }

    setSort(sortType) {
        this.currentSort = sortType;
    }

    setPosterFilter(value) {
        this.filterPoster = value;
    }

    getStats() {
        const movies = this.movies;
        if (movies.length === 0) return null;

        const years = movies
            .map(m => parseInt(m.Year))
            .filter(y => !isNaN(y));

        return {
            total: movies.length,
            withPoster: movies.filter(m => m.Poster && m.Poster !== 'N/A').length,
            oldestYear: years.length > 0 ? Math.min(...years) : null,
            newestYear: years.length > 0 ? Math.max(...years) : null,
            averageYear: years.length > 0
                ? Math.round(years.reduce((sum, y) => sum + y, 0) / years.length)
                : null
        };
    }
}