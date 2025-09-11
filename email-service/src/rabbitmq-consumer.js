import amqp from 'amqplib';

class RabbitMQConsumer {
  start(url, queueName) {
    amqp.connect(url, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }
        
        channel.assertQueue(queueName, {
          durable: true
        });
        
        channel.prefetch(1);
        
        console.log("Waiting for messages in %s", queueName);
        
        channel.consume(queueName, (msg) => {
          if (msg !== null) {
            const message = JSON.parse(msg.content.toString());
            console.log("Received:", message);
            
            // Process the message here
            this.processMessage(message)
              .then(() => {
                console.log("Message processed successfully");
                channel.ack(msg);
              })
              .catch(error => {
                console.error("Error processing message:", error);
                channel.nack(msg, false, true); // Requeue the message
              });
          }
        });
      });
    });
  }
  
  async processMessage(message) {
    // Implement your message processing logic here
    // For email service, this would send an email
  }
}

export default RabbitMQConsumer;