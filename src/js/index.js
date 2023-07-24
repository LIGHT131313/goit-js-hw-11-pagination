import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchQuary } from './pixabay-api';
import { createMarkUp, scrollMore } from './mymodules';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  // loadMore: document.querySelector('.load-more'),
  guard: document.querySelector('.js-guard'),
};

refs.form.addEventListener('submit', onSearch);
// refs.loadMore.addEventListener('click', onLoadMore);

let page = 1;
const perPage = 40;
let searchQuery = '';
let simpleGallery = '';
const simpleOptions = {
  captionsData: 'alt',
  captionDelay: 250,
};

/**
 * Рrocesses the element select and promise
 * @param {Object} evt
 */
function onSearch(evt) {
  evt.preventDefault();
  // refs.loadMore.hidden = true;
  searchQuery = refs.form.searchQuery.value;
  page = 1;
  refs.gallery.innerHTML = '';

  fetchQuary(searchQuery, page, perPage)
    .then(({ data }) => {
      if (!data.hits.length || !searchQuery.trim()) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        refs.gallery.innerHTML = createMarkUp(data.hits);

        simpleGallery = new SimpleLightbox('.gallery a', simpleOptions);

        Notify.success(`Hooray! We found ${data.totalHits} images.`);

        if (data.totalHits / perPage >= page) {
          // refs.loadMore.hidden = false;
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
 */
// function onLoadMore() {
//   page += 1;

//   fetchQuary(searchQuery, page, perPage)
//     .then(({ data }) => {
//       refs.gallery.insertAdjacentHTML('beforeend', createMarkUp(data.hits));

//       simpleGallery.refresh();

//       if (data.totalHits / perPage < page) {
//         refs.loadMore.hidden = true;

//         Notify.failure(
//           `We're sorry, but you've reached the end of search results.`
//         );
//       }

//       scrollMore(refs.gallery);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};

let observer = new IntersectionObserver(onPaginationGallary, options);

function onPaginationGallary() {
  fetchQuary(searchQuery, page, perPage)
    .then(({ data }) => {
      refs.gallery.insertAdjacentHTML('beforeend', createMarkUp(data.hits));

      simpleGallery.refresh();

      // if (data.totalHits / perPage < page) {
      //   refs.loadMore.hidden = true;

      //   Notify.failure(
      //     `We're sorry, but you've reached the end of search results.`
      //   );
      // }

      scrollMore(refs.gallery);
    })
    .catch(err => {
      console.log(err);
    });
}
