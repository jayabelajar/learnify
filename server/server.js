import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Learnify API running on port ${port}`);
  });
});
