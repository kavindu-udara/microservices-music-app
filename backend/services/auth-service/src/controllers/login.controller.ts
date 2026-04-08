import { FastifyReply, FastifyRequest } from "fastify";

type LoginRequestBody = {
  username: string;
  password: string;
};

const loginController = async (
  request: FastifyRequest<{ Body: LoginRequestBody }>,
  reply: FastifyReply,
) => {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      return reply.code(400).send({ error: "Username and password required" });
    }

    // TODO: Implement actual authentication logic (e.g., verify against DB, hash password)

    return reply.send({ token: "dummy-token-for-" + username });
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
};

export default loginController;
