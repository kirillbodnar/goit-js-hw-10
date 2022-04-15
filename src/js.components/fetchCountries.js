import { Notify } from 'notiflix';
export function fetchCountries(name) {
  const url = 'https://restcountries.com/v3.1/name/';
  const searchParameters = 'name,capital,population,flags,languages';
  return fetch(`${url}${name}?fields=${searchParameters}`)
    .then(response => {
      if (!response.ok) {
        Notify.failure('Oops, there is no country with that name');
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      return error;
    });
}
