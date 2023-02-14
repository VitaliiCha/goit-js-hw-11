import Notiflix from 'notiflix';
import API from './api.js';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const btnLoadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const formInput = form.querySelector('.input');
let inputValue = '';
let page = 0;

btnLoadMore.classList.add('hiden');

form.addEventListener('submit', onSubmit);
btnLoadMore.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();
  API.newSearcImages(1);
  gallery.innerHTML = ' ';
  btnLoadMore.classList.add('hiden');
  inputValue = formInput.value.trim();
  if (formInput.value.length === 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  API.searchImages(inputValue)
    .then(({ hits, totalHits }) => {
      page += hits.length;
      if (hits.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
        btnLoadMore.classList.remove('hiden');
        Hits(hits);
      }
    })

    .catch(onError)
    .finally(() => form.reset());
}

function onLoadMore() {
  API.searchImages(inputValue)
    .then(({ hits, totalHits }) => {
      page += hits.length;
      Hits(hits);
      if (page >= totalHits) {
        btnLoadMore.classList.add('hiden');
        throw new Error(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })

    .catch(onError);
}

function createImgList(images) {
  const markup = images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
    <div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b>${downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function Hits(hits) {
  createImgList(hits);
  new simpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}

function onError(Error) {
  Notiflix.Notify.failure(Error.message);
}
