import Fastify from 'fastify';

const app = Fastify({
    logger: true,
});

app.get('/', async (request, reply) => {
    return { message: 'Welcome to the API Gateway!' };
});

app.listen({port : 3000}, (err, address) => {
    if (err) {
        app.log.error(err);
        // process.exit(1);
    }
    app.log.info(`API Gateway is running at ${address}`);
});
