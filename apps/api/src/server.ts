import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
});

app.register(multipart, {
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB,
        files: 1
    }
});

const PORT = process.env.PORT || 4000;

app.listen({ port: Number(PORT), host: "localhost" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
