export default class API {
    constructor() {
        this.searchImg = '';
        this.page = 1;
    }
    fetchArticles() {
        const BASE_URL = 'https://pixabay.com/api'
        const KEY = '29892629-a08b1cbf310151e181ae0b83f';
        const url = `${BASE_URL}?key=${KEY}&q=${this.searchImg}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
        return axios(url)
            .then(response => response.json())
            .then(data => {
                this.incrementPage();

                return data.hits;
            });
    }

    incrementPage() {
        this.page += 1;
    }
    
    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchImg;
    }

    set query(newQuery) {
        this.searchImg = newQuery;
    }
}
