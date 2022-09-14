import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/fetchImg';
import LoadMoreBtn from './js/LoadMoreBtn'

const gallery = new SimpleLightbox('.gallery .photo-link');

const refs = {
    form: document.querySelector('.search-form'),
    listOfEl: document.querySelector('.gallery'),
};
const imgApiService = new API();

const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});

refs.form.addEventListener("submit", onSearch);
loadMoreBtn.refs.button.addEventListener("click", loadArticles);

async function onSearch(evt) {
    evt.preventDefault();
    imgApiService.query = evt.currentTarget.elements.searchQuery.value
    if (imgApiService.query === "") {
        return Notiflix.Notify.info('Please, make some query');
    }
    loadMoreBtn.show();
    imgApiService.resetPage();
    refs.listOfEl.innerHTML = '';
    loadArticles();
}
function appendArticles(listOfImg) {
    const markup = listOfImg.map((item) => {
        return `<a class="photo-link"  href=${item.largeImageURL}>
                <div class="photo-card">    
                    <img src=${item.webformatURL} alt=${item.tags} loading="lazy" />
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b>
                                <span>${item.likes}</span>
                            </p>
                            <p class="info-item">
                                <b>Views</b>
                                <span>${item.views}</span>
                            </p>
                            <p class="info-item">
                                <b>Comments</b>
                                <span>${item.comments}</span>
                            </p>
                            <p class="info-item">
                                <b>Downloads</b>
                                <span>${item.downloads}</span>
                            </p>
                        </div>
                </div>
                </a>`     
    }).join("");
    refs.listOfEl.insertAdjacentHTML('beforeend', markup)
    gallery.refresh();
}
function loadArticles() {    
    loadMoreBtn.disable();
    imgApiService.fetchArticles().then(articles => {
        if (articles.totalHits <= imgApiService.page * imgApiService.pageLimit) {
            loadMoreBtn.disable();
            loadMoreBtn.hide();
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
        appendArticles(articles.hits);
        loadMoreBtn.enable();
    }).catch(onFetchError);
}

async function onFetchError() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}