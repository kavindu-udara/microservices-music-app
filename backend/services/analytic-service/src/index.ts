import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: [ process.env.KAFKA_BROKER || "localhost:9094"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "analytic-service" });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topics: ["catalog-service", "auth-service"],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        switch (topic) {
          case "catalog-service":
            console.log(
              `Received message from catalog-service: ${message.value?.toString()}`,
            );
            break;
          case "auth-service":
            console.log(
              `Received message from auth-service: ${message.value?.toString()}`,
            );
            break;
          default:
            console.log(
              `Received message from unknown topic ${topic}: ${message.value?.toString()}`,
            );
        }
      },
    });
  } catch (error) {
    console.error("Error in Kafka consumer:", error);
  }
};

run().catch(console.error);
