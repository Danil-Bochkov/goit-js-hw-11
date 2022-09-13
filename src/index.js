import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/fetchImg';

const gallery = new SimpleLightbox('.gallery .photo-link');
const refs = {
    form: document.querySelector('.search-form'),
    inputEl: document.querySelector('.search-form input'),
    listOfEl: document.querySelector('.gallery'),
    btnEl: document.querySelector('.load-more')
};
const imgApiService = new API();

refs.form.addEventListener("submit", onSearch);
refs.btnEl.addEventListener("click", onLoadMore);

function onSearch(evt) {
    evt.preventDefault();
    imgApiService.query = evt.currentTarget.elements.searchQuery.value
    imgApiService.resetPage();
    imgApiService.fetchArticles().then(appendArticles).catch(onFetchError);
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
function onLoadMore() {
    imgApiService.fetchArticles().then(appendArticles).catch(onFetchError);
}
function onFetchError() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}
// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });
 