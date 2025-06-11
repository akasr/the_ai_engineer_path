import express from 'express';
import { movieAgent } from './services/movieAgent.js';
import fetchMoviePoster from './services/fetchMoviePoster.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('src'));
app.use(express.json());

app.post('/api/movie', async (request, response) => {
  try {
    const { preferences, movies, time } = request.body;

    // Input validation
    if (!preferences || !movies || time === undefined || time === null) {
      return response.status(400).json({
        error: 'Missing required parameters: preferences, movies, or time.',
      });
    }

    if (!Array.isArray(movies)) {
      return response.status(400).json({
        error: 'Parameter "movies" must be an array.',
      });
    }

    const movieRecommendations = await movieAgent(preferences, movies, time);
    const poster = await fetchMoviePoster(movieRecommendations.title);
    movieRecommendations.poster = poster;

    // movieAgent returns a single movie object, not an array
    if (!movieRecommendations || !movieRecommendations.title) {
      return response
        .status(404)
        .json({ error: 'No movie recommendations found.' });
    }

    response.status(200).json(movieRecommendations);
  } catch (error) {
    console.error('Error in /api/movie:', error.message);
    console.error('Stack trace:', error.stack);
    response.status(500).json({
      error: 'Failed to generate movie recommendations.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
