import { getPhotos } from './search';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchBtn = document.querySelector('.btn-search');
const gallery = document.querySelector('.gallery');
const inputText = document.querySelector('input');

let pageCount = 1;
let isLoading = false;

searchBtn.addEventListener('click', async event => {
  event.preventDefault();
  try {
    pageCount = 1;
    scrollToTop();
    const res = await getPhotos(inputText.value, pageCount);
    refreshCards(res.hits);
  } catch (error) {
    console.error(error);
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
  });
}

function refreshCards(arr) {
  if (pageCount === 1) {
    gallery.innerHTML = ' ';
  }

  let str = '';
  for (const item of arr) {
    str += `<div class="photo-card">
      <a href="${item.largeImageURL}" data-lightbox="gallery">
        <img src="${item.previewURL}" alt="" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b></br>${item.likes}
        </p>
        <p class="info-item">
          <b>Views</b></br>${item.views}
        </p>
        <p class="info-item"> 
          <b>Comments</b></br>${item.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b></br>${item.downloads}
        </p>
      </div>
    </div>`;
  }
  gallery.innerHTML += str;

  const lightbox = new SimpleLightbox('.photo-card a');

  if (arr.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  pageCount += 1;
  isLoading = false;
}

window.addEventListener('scroll', async () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 300 && !isLoading) {
    isLoading = true;
    try {
      const res = await getPhotos(inputText.value, pageCount);
      refreshCards(res.hits);
    } catch (error) {
      console.error(error);
    }
  }
});
