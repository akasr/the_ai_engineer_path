import '/components/StartPage.js';
import '/components/PreferencePage.js';
import '/components/MoviePage.js';
import fetchMovie from './services/fetchMovie.js';

window.state = {
  currentPage: 'start',
  currentUser: 0,
  totalUsers: 0,
  time: '',
  preferences: [],
  movies: [],
};

document.addEventListener('DOMContentLoaded', () => {
  const startPage = document.createElement('start-page');
  document.body.appendChild(startPage);

  document.body.addEventListener('start', handleStartEvent);
  document.body.addEventListener('next', handleNextEvent);
  document.body.addEventListener('movie', handleMovieEvent);
});

function handleStartEvent(event) {
  console.log(
    'Starting preference collection for',
    window.state.totalUsers,
    'users'
  );
  showPreferencePage();
}

async function handleNextEvent(event) {
  console.log(
    'Moving to next user:',
    window.state.currentUser,
    'of',
    window.state.totalUsers
  );
  if(window.state.currentPage === 'preference') {
    showPreferencePage();
  } else {
    await showMoviePage();
  }
}

async function handleMovieEvent(event) {
  await showMoviePage();
}

function removeCurrentPage() {
  const currentPage = document.querySelector(
    'start-page, preference-page, movie-page'
  );
  if (currentPage) {
    currentPage.remove();
  }
}

async function showMoviePage() {

  const data = await fetchMovie(window.state.preferences, window.state.movies, window.state.time);

  if (!data) {
    console.error('No movie data received');
    return;
  }

  removeCurrentPage();

  const moviePage = document.createElement('movie-page');
  document.body.appendChild(moviePage);
  moviePage.querySelector('h1.title').textContent = data.title;
  moviePage.querySelector('p.description').textContent = data.description;
}

function showPreferencePage() {
  removeCurrentPage();

  const preferencePage = document.createElement('preference-page');
  document.body.appendChild(preferencePage);


  updateUserTitle();
}

function updateUserTitle() {
  setTimeout(() => {
    const title = document.querySelector('h1.title');
    if (title) {
      title.textContent = window.state.currentUser;
    }
  }, 0);
}