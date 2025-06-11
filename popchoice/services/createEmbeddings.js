import ollama from 'ollama';

export async function createEmbeddings(chunks) {
  try {
    if (!Array.isArray(chunks)) {
      throw new Error('Chunks parameter must be an array');
    }

    if (chunks.length === 0) {
      console.warn('No chunks provided for embedding creation');
      return [];
    }

    const data = await Promise.all(
      chunks.map(async (chunk, index) => {
        try {
          if (!chunk || !chunk.pageContent) {
            console.warn(`Chunk at index ${index} is missing pageContent`);
            return null;
          }

          const embeddingResponse = await ollama.embeddings({
            model: 'nomic-embed-text',
            prompt: chunk.pageContent,
          });

          if (!embeddingResponse.embedding) {
            console.warn(
              `Failed to generate embedding for chunk at index ${index}`
            );
            return null;
          }

          return {
            content: chunk.pageContent,
            embedding: embeddingResponse.embedding,
          };
        } catch (chunkError) {
          console.error(
            `Error processing chunk at index ${index}:`,
            chunkError.message
          );
          return null;
        }
      })
    );

    // Filter out null results
    const validData = data.filter(item => item !== null);

    if (validData.length === 0) {
      throw new Error('Failed to create embeddings for any chunks');
    }

    return validData;
  } catch (error) {
    console.error('Error in createEmbeddings:', error.message);
    throw error;
  }
}
