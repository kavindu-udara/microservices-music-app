import express from 'express';
import RabbitMQConsumer from './rabbitmq-consumer.js';
import EmailController from './controllers/emailController.js';
import dotenv from "dotenv"

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Initialize email controller
const emailController = new EmailController();

// Initialize RabbitMQ consumer
const rabbitMQConsumer = new RabbitMQConsumer();

// Start consuming messages
rabbitMQConsumer.start(process.env.RABBITMQ_URL, process.env.QUEUE_NAME, 
  async (message) => {
    if (message.type === 'send_email') {
      await emailController.sendEmail(message.data);
    }
  });

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'email-service' });
});

app.listen(port, () => {
  console.log(`Email service running on port ${port}`);
});