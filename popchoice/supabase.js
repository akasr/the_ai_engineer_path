import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { splitDocument } from './services/splitDocument.js';
import { createEmbeddings } from './services/createEmbeddings.js';

const privateKey = process.env.SUPABASE_API_KEY;
if (!privateKey) {
  throw new Error('Supabase API key is not set in environment variables.');
}
const url = process.env.SUPABASE_URL;
if (!url) {
  throw new Error('Supabase URL is not set in environment variables.');
}
const supabase = createClient(url, privateKey);

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
