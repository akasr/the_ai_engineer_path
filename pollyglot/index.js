import 'dotenv/config';
import express from 'express';
import translational from './services/translational';


const app = express();
app.use(express.static('src'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});