import ollama from 'ollama';
import supabase from '../supabase.config.js';

async function createEmbedding(query) {
  try {
    const response = await ollama.embeddings({
      model: 'nomic-embed-text',
      prompt: query,
    });
    return response.embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

async function searchMovies(query) {
  const embedding = await createEmbedding(query);

  const {data} = await supabase.rpc('match_movies', {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: 10
  });

  console.log('data', data);
}

await searchMovies('action movies with a strong female lead');