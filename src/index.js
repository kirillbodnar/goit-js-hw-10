import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js.components/fetchCountries';

const refs = {
  input: document.querySelector('#search-box'),
  countries: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const name = e.target.value.trim();
  if (name === '') {
    clearMarkUp();
    return;
  }
  fetchCountries(name)
    .then(countries => {
      clearMarkUp();
      if (countries.length > 10) {
        Notify.warning('Too many matches found. Please enter a more specific name.');
      } else if (countries.length <= 10 && countries.length > 1) {
        appendCountryListMarkUp(countries);
      } else if (countries.length === 1) {
        appendCountryInfoMarkUp(countries[0]);
      }
    })
    .catch(clearMarkUp);
}

function createCountriesListMarkup(countries) {
  return countries
    .map(({ name, flags }) => {
      return `
<li class="country__item">
    <img class="country__flag" src="${flags.svg}" alt="${name.common}" width="50px">
    <p class="country__name">${name.common}</p>
    </li>`;
    })
    .join('');
}

function createCountryInfoMarkup({ name, population, capital, flags, languages }) {
  let language = 'null';
  if (Object.keys(languages).length === 1) {
    language = 'Language';
  } else {
    language = 'Languages';
  }

  return `<img class="country-info__flag" src="${flags.svg}" alt="${name.common}" width="50px">
    <h1 class="country-info__name">${name.common}</h1>
    <ul class="country-info__list">
    <li class="country-info__item"><span class="country-info__item--title">Capital:</span> ${capital}</li>
    <li class="country-info__item"><span class="country-info__item--title">Population:</span> ${population}</li>
    <li class="country-info__item"><span class="country-info__item--title">${language}:</span> ${Object.values(
    languages,
  ).join(', ')}</li>
    </ul> `;
}

function appendCountryListMarkUp(countries) {
  refs.countries.insertAdjacentHTML('beforeend', createCountriesListMarkup(countries));
}

function appendCountryInfoMarkUp(country) {
  refs.countryInfo.insertAdjacentHTML('beforeend', createCountryInfoMarkup(country));
}

function clearMarkUp() {
  refs.countries.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
