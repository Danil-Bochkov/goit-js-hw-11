import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import API from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
    inputEl: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
};
 
refs.inputEl.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
    evt.preventDefault();
    const form = evt.target;
    let searchCountry = form.value.trim();
    form.value = searchCountry;
    if (searchCountry != "") {
        API.fetchCountries(searchCountry)
            .then(checkLength)
            .catch(onFetchError)
    } else {
        refs.countryList.innerHTML = "";
    }
} 

function onFetchError() {
    Notiflix.Notify.failure("Oops, there is no country with that name");
}

function checkLength(listOfCountries) {
    if (listOfCountries.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    } else if (listOfCountries.length <= 10 && listOfCountries.length >= 2) {
        refs.countryInfo.innerHTML = "";
        renderCountryList(listOfCountries);
    } else {
        refs.countryList.innerHTML = "";
        renderCountryInfo(listOfCountries);
    }
}

function renderCountryInfo(listOfCountries) {
    const markup = listOfCountries
        .map((n) => {
            let langList = "";
            for (let lang in n.languages) {
                langList += n.languages[lang] + ", ";
            }
            return `
            <h1><img class="icon" src=${n.flags.svg} />${n.name.official}</h1>
            <p><b>Capital</b>: ${n.capital}</p>
            <p><b>Population</b>: ${n.population}</p>
            <p><b>Languages</b>: ${langList.slice(0, -2)}</p>`
    })
    .join("");
  refs.countryInfo.innerHTML = markup;
}
    
function renderCountryList(listOfCountries) {
    const listOfItems = listOfCountries
    .map((n) => {
        return `
        <li>
            <img width="20" height="15" src=${n.flags.svg} />
            <span>${n.name.official}</span>
        </li>`
    })
    .join("");
    refs.countryList.innerHTML = listOfItems;
}