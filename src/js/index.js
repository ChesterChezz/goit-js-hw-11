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
    scrollTop();
    const res = await getPhotos(inputText.value, pageCount);
    refreshCards(res.hits);
  } catch (error) {
    console.error(error);
  }
});

function refreshCards(arr) {
  let str = '';

  if (pageCount === 1) {
    gallery.innerHTML = '';
  }

  if (arr.length >= 40) {
    window.addEventListener('scroll', handleScroll);
  } else {
    window.removeEventListener('scroll', handleScroll);
    Notiflix.Notify.info(
      'That`s all the pictures we have found for your request!'
    );
  }

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

  gallery.insertAdjacentHTML('beforeend', str);

  const lightbox = new SimpleLightbox('.photo-card a');

  if (arr.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  pageCount += 1;
  isLoading = false;
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 300 && !isLoading) {
    isLoading = true;
    getPhotos(inputText.value, pageCount)
      .then(res => {
        refreshCards(res.hits);
      })
      .catch(error => {
        console.error(error);
      });
  }
}

const scrollToTopBtn = document.querySelector('.scroll-down');

// Показати або приховати кнопку прокрутки вверх
function toggleScrollToTopButton() {
  if (window.scrollY > 1000) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
}

// Прокрутка сторінки вверх при натисканні на кнопку
function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// Встановити обробник події для кнопки прокрутки вверх
scrollToTopBtn.addEventListener('click', scrollTop);

// Встановити обробник події для події прокрутки сторінки
window.addEventListener('scroll', toggleScrollToTopButton);

// Викликати функцію для перевірки початкового положення прокрутки
toggleScrollToTopButton();
