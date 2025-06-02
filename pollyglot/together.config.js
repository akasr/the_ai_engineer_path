import together from 'together-ai';
import 'dotenv/config';

if(!process.env.TOGETHER_API_KEY) {
  throw new Error('TOGETHER_API_KEY is not set in the environment variables');
}

export default new together({
  apiKey: process.env.TOGETHER_API_KEY,
});