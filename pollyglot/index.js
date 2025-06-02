import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import translational from './services/translational.js';

const app = express();
app.use(express.static('src'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});

app.use(limiter);

app.post('/api/translate', limiter, async (request, response) => {
  try {
    const { message, language } = request.body;
    
    if (!message || !language) {
      return response.status(400).json({ error: "Message and language are required" });
    }

    const translation = await translational(message, language);
    return response.json({ translation });
  } catch (error) {
    console.error("Error in translation API:", error);
    return response.status(500).json({ error: "Translation service temporarily unavailable" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});