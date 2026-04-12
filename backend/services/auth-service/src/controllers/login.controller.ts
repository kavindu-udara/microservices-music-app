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

    const sanitizedUser = {
      id: existingUser.id,
      fname: existingUser.fname,
      lname: existingUser.lname,
      email: existingUser.email,
    };

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

    // send token as a httpOnly cookie
    reply.setCookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });

    return reply.send({ message: "Login Successfull", user : sanitizedUser });
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
};

export default loginController;
