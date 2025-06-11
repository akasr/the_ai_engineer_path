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

// Security function to validate image URLs
function isValidImageUrl(url) {
  try {
    const parsedUrl = new URL(url);
    // Only allow HTTP/HTTPS protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    // Basic check for image file extensions or known image hosts
    const pathname = parsedUrl.pathname.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const trustedHosts = [
      'm.media-amazon.com',
      'ia.media-imdb.com',
      'image.tmdb.org',
    ];

    return (
      imageExtensions.some(ext => pathname.includes(ext)) ||
      trustedHosts.some(host => parsedUrl.hostname.includes(host))
    );
  } catch (e) {
    return false;
  }
}

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
  if (window.state.currentPage === 'preference') {
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
  const data = await fetchMovie(
    window.state.preferences,
    window.state.movies,
    window.state.time
  );

  if (!data) {
    console.error('No movie data received');
    return;
  }

  removeCurrentPage();

  const moviePage = document.createElement('movie-page');
  document.body.appendChild(moviePage);
  moviePage.querySelector('h1.title').textContent = data.title;
  moviePage.querySelector('p.description').textContent = data.description;

  // Log the data to see what properties are available
  console.log('Movie data received:', data);

  const posterContainer = moviePage.querySelector('div.poster');
  console.log('Poster container found:', posterContainer);

  if (!posterContainer) {
    console.error('Poster container not found in movie page');
    return;
  }

  // Only try to display poster if data.poster exists
  if (data.poster && isValidImageUrl(data.poster)) {
    const img = document.createElement('img');
    img.src = data.poster;
    img.alt = `${data.title} Poster`;
    img.style.width = '100%';
    img.style.height = 'auto';
    img.onerror = function () {
      console.log('Failed to load poster, keeping default styling');
      this.remove();
    };
    posterContainer.innerHTML = '';
    posterContainer.appendChild(img);
  } else {
    console.log(
      'No poster data available or invalid URL, keeping default styling'
    );
    // Keep the default gradient background from CSS
  }
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
