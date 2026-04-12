export const createArtist = async (request, reply) => {
    const { name, bio,  } = request.body;
    // Logic to create an artist in the database
    reply.send({ message: 'Artist created successfully' });
};
