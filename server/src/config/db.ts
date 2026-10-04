import mongoose from 'mongoose';

export async function connectDB() {
  if (process.env.SKIP_DB === 'true') {
    console.warn('SKIP_DB=true. API started without database connection.');
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not set. API started without database connection.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}
