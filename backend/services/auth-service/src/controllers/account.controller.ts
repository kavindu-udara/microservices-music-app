import { FastifyReply, FastifyRequest } from "fastify";

const accountController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // get the JWT token from the request header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    // verify the token
    const decoded = await request.jwtVerify();

    // return the decoded token data as the account information
    return reply.send({ account: decoded });
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
};

export default accountController;
