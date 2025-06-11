import ollama from 'ollama';

export async function createEmbeddings(chunks) {
  try {
    const data = await Promise.all(
      chunks.map(async chunk => {
        const embeddingResponse = await ollama.embeddings({
          model: 'nomic-embed-text',
          prompt: chunk.pageContent,
        });
        return {
          content: chunk.pageContent,
          embedding: embeddingResponse.embedding,
        };
      })
    );
    return data;
  } catch (error) {
    console.error('Error in createEmbeddings:', error);
    return [];
  }
}
