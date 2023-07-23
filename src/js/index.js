import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchQuary } from './pixabay-api';
import { createMarkUp } from './mymodules';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);
let page = 1;
const perPage = 40;
let simpleGallery;

/**
 * Рrocesses the element select and promise
 * @param {Object} evt
 */
function onSearch(evt) {
  evt.preventDefault();
  refs.loadMore.hidden = true;
  searchQuery = refs.form.searchQuery.value;
  page = 1;

  fetchQuary(searchQuery, page, perPage)
    .then(({ data }) => {
      if (!data.hits.length || !searchQuery.trim()) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        refs.gallery.innerHTML = createMarkUp(data.hits);

        simpleGallery = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });

        Notify.success(`Hooray! We found ${data.totalHits} images.`);

        if (data.totalHits / perPage >= page) {
          refs.loadMore.hidden = false;
        }
      }
    })
    .catch(err => {
      console.log(err);
    });

  evt.target.reset();
}

/**
 * Рrocesses the element select and promise
 * @param {Object} evt
 */
function onLoadMore(evt) {
  page += 1;

  fetchQuary(searchQuery, page, perPage)
    .then(({ data }) => {
      refs.gallery.insertAdjacentHTML('beforeend', createMarkUp(data.hits));

      simpleGallery.refresh();

      if (data.totalHits / perPage < page) {
        refs.loadMore.hidden = true;

        Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
      }
    })
    .catch(err => {
      console.log(err);
    });
}
