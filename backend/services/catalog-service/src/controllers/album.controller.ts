export const createAlbum = async (request, reply) => {
    const { title, artist } = request.body;
    // Logic to create an album in the database
    reply.send({ message: 'Album created successfully' });
};
