import { splitDocument } from './services/splitDocument.js';
import { createEmbeddings } from './services/createEmbeddings.js';
import supabase from './supabase.config.js';

export async function storeDocument(document) {
  try {
    const chunks = await splitDocument(document);
    const data = await createEmbeddings(chunks);

    await supabase.from('popchoice').insert(data);
    console.log('Embeddings stored in Supabase successfully.');
  } catch (error) {
    console.error('Error in storeDocument:', error);
  }
}

storeDocument('movies.txt');