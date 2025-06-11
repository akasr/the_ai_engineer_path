export default async function fetchMovie(preferences, movies, time) {
  try {
    const response = await fetch('/api/movie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences, movies, time }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Received movie data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching movie:', error);
  }
}