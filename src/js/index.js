import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { selectCreateMarkUp, createMarkUp } from './mymodules';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  select: document.querySelector('.breed-select'),
  pLoader: document.querySelector('.loader'),
  div: document.querySelector('.cat-info'),
};

refs.pLoader.hidden = false;

fetchBreeds()
  .then(({ data }) => {
    refs.select.innerHTML = selectCreateMarkUp(data);

    refs.select.hidden = false;
  })
  .catch(err => {
    console.log(err.message);

    Notify.failure(`Oops! Something went wrong! Try reloading the page!`, {
      position: 'center-center',
    });
  })
  .finally(() => {
    refs.pLoader.hidden = true;
  });

refs.select.addEventListener('change', onSelect);

/**
 * Рrocesses the element select and promise
 * @param {Object} evt
 */
function onSelect(evt) {
  const breedId = evt.currentTarget.value;
  refs.pLoader.hidden = false;
  refs.div.innerHTML = '';

  fetchCatByBreed(breedId)
    .then(({ data }) => {
      refs.div.innerHTML = createMarkUp(data);
    })
    .catch(err => {
      console.log(err.message);

      Notify.failure(`Oops! Something went wrong! Try reloading the page!`, {
        position: 'center-center',
      });
    })
    .finally(() => {
      refs.pLoader.hidden = true;
    });
}
