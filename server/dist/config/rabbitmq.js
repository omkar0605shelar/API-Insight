import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();
let connection;
let channel;
export const connectRabbitMQ = async () => {
    try {
        const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
        const socketOptions = url.startsWith('amqps')
            ? { cert: '', key: '', rejectUnauthorized: false }
            : {};
        connection = await amqp.connect(url, socketOptions);
        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
        });
        connection.on('close', () => {
            console.warn('RabbitMQ connection closed.');
        });
        channel = await connection.createChannel();
        const displayUrl = url.includes('@') ? url.split('@').pop() : url;
        console.log(`RabbitMQ Connected to ${displayUrl}`);
        // Assert required queues
        const queues = ['api_scan_jobs'];
        for (const q of queues) {
            await channel.assertQueue(q, { durable: true });
        }
        return channel;
    }
    catch (error) {
        console.error('RabbitMQ Connection Error:', error);
        throw error;
    }
};
export const getChannel = () => channel;
