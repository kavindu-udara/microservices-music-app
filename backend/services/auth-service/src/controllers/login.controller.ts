import bcrypt from "bcryptjs";
import { prisma } from "@packages/shared/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

type LoginRequestBody = {
  email: string;
  password: string;
};

const loginController = async (
  request: FastifyRequest<{ Body: LoginRequestBody }>,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ error: "Username and password required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }

    const passwordMatch = bcrypt.compareSync(password, existingUser.password);
    if (!passwordMatch) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }

    const token = await reply.jwtSign(
      {
        userId: existingUser.id,
        firstName: existingUser.fname,
        lastName: existingUser.lname,
        email: existingUser.email,
      },
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      },
    );

    return reply.send({ token, message: "Login Successfull" });
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
};

export default loginController;
