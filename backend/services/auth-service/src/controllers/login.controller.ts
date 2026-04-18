import bcrypt from "bcryptjs";
import { prisma } from "@packages/shared/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { loginSchema } from "@packages/shared/schema";

type LoginRequestBody = {
  email: string;
  password: string;
};

const loginController = async (
  request: FastifyRequest<{ Body: LoginRequestBody }>,
  reply: FastifyReply,
) => {
  try {
    const validationResult = loginSchema.safeParse(request.body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return reply.code(400).send({
        error: "Validation failed",
        errors,
      });
    }

    const { email, password } = validationResult.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }

    if (existingUser.password) {
      const passwordMatch = bcrypt.compareSync(password, existingUser.password);
      if (!passwordMatch) {
        return reply.code(401).send({ error: "Invalid email or password" });
      }
    }else{
      // send a response that says you used a different login method and should use that instead
      return reply.code(400).send({ error: "Please use the login method you used to create this account." });
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
        role: existingUser.role,
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

    return reply.send({ message: "Login Successfull", user: sanitizedUser });
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
};

export default loginController;
