import { FastifyReply, FastifyRequest } from "fastify";

const accountController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    if (!request.cookies.token) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    // Verify JWT using cookie authentication.
    const decoded = await request.jwtVerify({ onlyCookie: true });

    // return the decoded token data as the account information
    return reply.send({ account: decoded });
  } catch (error: any) {
    reply.code(401).send({ error: "Unauthorized", message: error.message });
  }
};

export default accountController;
