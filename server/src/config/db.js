import mongoose from 'mongoose';

export async function connectDB() {
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
