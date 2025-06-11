import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('src'));
app.use(express.json());

app.post('/api/movie', async (request, response) => {
  const body = await request.body;
  const preferences = body.preferences;
  const movies = body.movies;
  console.log('Received preferences:', preferences);
  console.log('Received movies:', movies);

  response.json({
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
