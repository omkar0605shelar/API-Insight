import dotenv from 'dotenv';
import { initDb } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { startWorker as startScannerWorker } from './workers/scannerWorker.js';

dotenv.config();

const start = async () => {
  try {
    console.log('Starting standalone background worker...');
    
    // Initialize infrastructure
    await initDb();
    await connectRedis();
    await connectRabbitMQ();
    
    // Start specific queue consumers
    startScannerWorker();
    
    console.log('Worker initialization complete. Listening for tasks...');
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
};

start();
