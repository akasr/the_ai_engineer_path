import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const privateKey = process.env.SUPABASE_API_KEY;
if (!privateKey) {
  throw new Error('Supabase API key is not set in environment variables.');
}
const url = process.env.SUPABASE_URL;
if (!url) {
  throw new Error('Supabase URL is not set in environment variables.');
}
const supabase = createClient(url, privateKey);
export default supabase;