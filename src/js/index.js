import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchQuary } from './pixabay-api';
import { createMarkUp, scrollMore } from './mymodules';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
};

refs.form.addEventListener('submit', onSearch);

let page = 1;
const perPage = 40;
let searchQuery = '';
let simpleGallery = '';
const simpleOptions = {
  captionsData: 'alt',
  captionDelay: 250,
};
const observerOptions = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};
let observer = new IntersectionObserver(onPaginationGallary, observerOptions);

/**
 * Рrocesses the element select and promise
 * @param {Object} evt
 */
function onSearch(evt) {
  evt.preventDefault();
  searchQuery = refs.form.searchQuery.value;

  if (!searchQuery.trim()) {
    Notify.failure('Please enter a non-empty search query');
  } else {
    page = 1;
    refs.gallery.innerHTML = '';

    fetchQuary(searchQuery, page, perPage)
      .then(({ data }) => {
        if (!data.hits.length) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          console.log('onSearch', data.totalHits / perPage);
          console.log('onSearch', page);
          refs.gallery.innerHTML = createMarkUp(data.hits);

          simpleGallery = new SimpleLightbox('.gallery a', simpleOptions);

          Notify.success(`Hooray! We found ${data.totalHits} images.`);

          if (data.totalHits / perPage >= page) {
            observer.observe(refs.guard);
          }
        }
      })
      .catch(() => {
        location.href = './error.html';
      });
  }
  evt.target.reset();
}

/**
 * Рrocesses pagination and promise
 * @param {Object} entries
 * @param {Object} observer
 */
function onPaginationGallary(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchQuary(searchQuery, page, perPage)
        .then(({ data }) => {
          refs.gallery.insertAdjacentHTML('beforeend', createMarkUp(data.hits));

          simpleGallery.refresh();

          if (data.totalHits / perPage <= page) {
            console.log('onPaginationGallary', data.totalHits / perPage);
            console.log('onPaginationGallary', page);
            observer.unobserve(entry.target);
            Notify.failure(
              `We're sorry, but you've reached the end of search results.`
            );
          }

          // scrollMore(refs.gallery);
        })
        .catch(() => {
          location.href = './error.html';
        });
    }
  });
}
