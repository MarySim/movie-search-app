export class MovieApi {
    constructor(apiKey) {
        this.baseUrl = 'https://www.omdbapi.com/';
        this.apiKey = apiKey;
    }

    async searchMovies(query, type = '') {
        const params = new URLSearchParams({
            apikey: this.apiKey,
            s: query
        });
        
        if (type) {
            params.set('type', type);
        }

        const response = await fetch(`${this.baseUrl}?${params}`);
        const data = await response.json();

        if (data.Response === 'False') {
            throw new Error(data.Error || 'Ничего не найдено');
        }

        return data.Search;
    }

    async getMovieById(id) {
        const params = new URLSearchParams({
            apikey: this.apiKey,
            i: id,
            plot: 'short'
        });

        const response = await fetch(`${this.baseUrl}?${params}`);
        const data = await response.json();

        if (data.Response === 'False') {
            throw new Error(data.Error || 'Фильм не найден');
        }

        return data;
    }
}