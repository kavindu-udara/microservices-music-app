export const createTrack = async (request, reply) => {
    const { title, artist, album } = request.body;
    // Logic to create a track in the database
    reply.send({ message: 'Track created successfully' });
};
