import 'dotenv/config';

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export default async function fetchMoviePoster(title) {
  try {
    if (!title) {
      throw new Error('Movie title is required to fetch poster.');
    }

    const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
      title
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching movie poster: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.Response === 'False') {
      throw new Error(`Movie not found: ${title}`);
    }

    return data.Poster || 'No poster available';
  } catch (error) {
    console.error('Error in fetchMoviePoster:', error);
    throw error;
  }
}
