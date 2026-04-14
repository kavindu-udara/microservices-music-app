import {Kafka} from "kafkajs";

const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ["localhost:9094"],
});

const admin = kafka.admin();

const run = async () => {
    await admin.connect();
    await admin.createTopics({
        topics: [
            {topic: "catalog-events"},
            {topic: "auth-events"},
        ],
    });
    console.log("Topics created successfully");
    await admin.disconnect();
}

run().catch(console.error);
