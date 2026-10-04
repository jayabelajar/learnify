import mongoose from 'mongoose';
import dns from 'node:dns';

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

  if (process.env.MONGODB_DNS_SERVERS) {
    dns.setServers(process.env.MONGODB_DNS_SERVERS.split(',').map((server) => server.trim()));
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || 'learnify'
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}
