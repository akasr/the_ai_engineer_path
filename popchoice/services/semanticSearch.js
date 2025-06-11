import ollama from 'ollama';
import supabase from '../supabase.config.js';

async function createEmbedding(query) {
  try {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string');
    }

    const response = await ollama.embeddings({
      model: 'nomic-embed-text',
      prompt: query,
    });

    if (!response.embedding) {
      throw new Error('Failed to generate embedding - no embedding returned');
    }

    return response.embedding;
  } catch (error) {
    console.error('Error creating embedding:', error.message);
    throw error;
  }
}

export default async function searchMovies(query) {
  try {
    if (!query) {
      throw new Error('Query parameter is required');
    }

    const embedding = await createEmbedding(query);

    const { data, error } = await supabase.rpc('match_movies', {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 10,
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchMovies:', error.message);
    throw error;
  }
}
