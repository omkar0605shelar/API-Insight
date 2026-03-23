import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

if (!process.env.REDIS_URL) {
  console.warn('⚠️  REDIS_URL not found in environment variables. Defaulting to redis://localhost:6379');
}

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err.message);
  if (err.code === 'ECONNREFUSED') {
    console.error('👉 Make sure Redis is running and accessible at', REDIS_URL);
  }
});

redisClient.on('connect', () => console.log('✅ Redis Client Connected'));

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err: any) {
    console.error('❌ Failed to connect to Redis:', err.message);
  }
};

export default redisClient;
