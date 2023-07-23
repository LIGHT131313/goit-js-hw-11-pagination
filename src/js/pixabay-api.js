import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38406693-dc9f858473ae6436eca73fc0b';

const params = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

/**
 * Get searchQuery from api server
 * @param {String} searchQuery
 * @param {Number} page
 * @param {Number} perPage
 * @returns promise
 */
async function fetchQuary(searchQuery, page, perPage) {
  return await axios(
    `${BASE_URL}?q=${searchQuery}&${params}&page=${page}&per_page=${perPage}`
  );
}

export { fetchQuary };
