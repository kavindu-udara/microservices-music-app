import { FastifyReply, FastifyRequest } from "fastify";

type RegisterRequestBody = {
    username: string;
    password: string;
}

export const registerController = async (request: FastifyRequest<{Body : RegisterRequestBody}>, reply: FastifyReply) => {
    try {
        const { username, password } = request.body;

        if (!username || !password) {
            return reply.code(400).send({ error: "Username and password required" });
        }

        // TODO : Implement actual user registration logic (e.g., save to DB, hash password)

        return reply.send({ message: "User registered successfully" });
    } catch (error: any) {
        reply
            .code(500)
            .send({ error: "Internal Server Error", message: error.message });
    }
};

export default registerController;