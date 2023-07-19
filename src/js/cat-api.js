import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_CtYxUR0rr6cCPSYqQbWHh9lYDHOf62OtaaNlYhaCoh7HDrnbooTKtvSooG6o3QuU';
const BASE_URL = 'https://api.thecatapi.com/v1';
const AND_POINT_BREEDS = '/breeds';
const AND_POINT_IMG_SEARCH = '/images/search';

/**
 * Get breeds from api server
 * @returns promise
 */
function fetchBreeds() {
  return axios.get(`${BASE_URL}${AND_POINT_BREEDS}`);
}

/**
 * Get cat by breeds from api server
 * @param {Number} breedId
 * @returns promise
 */
function fetchCatByBreed(breedId) {
  return axios.get(`${BASE_URL}${AND_POINT_IMG_SEARCH}?breed_ids=${breedId}`);
}

export { fetchBreeds, fetchCatByBreed };
