import express from 'express';
import { movieAgent } from './services/movieAgent.js';
import fetchMoviePoster from './services/fetchMoviePoster.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.static('src'));
app.use(express.json({ limit: '1mb' })); // Add size limit

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

    if (!Array.isArray(preferences)) {
      return response.status(400).json({
        error: 'Parameter "preferences" must be an array.',
      });
    }

    // Validate time parameter
    if (typeof time !== 'string' && typeof time !== 'number') {
      return response.status(400).json({
        error: 'Parameter "time" must be a string or number.',
      });
    }

    // Basic size limits
    if (preferences.length > 10 || movies.length > 10) {
      return response.status(400).json({
        error: 'Too many preferences or movies provided.',
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
    // Only log stack trace in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error.stack);
    }
    response.status(500).json({
      error: 'Failed to generate movie recommendations.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
