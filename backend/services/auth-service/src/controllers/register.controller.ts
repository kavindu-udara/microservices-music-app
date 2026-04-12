import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@packages/shared/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@packages/shared/schema";

type RegisterRequestBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
};

export const registerController = async (
    request: FastifyRequest<{ Body: RegisterRequestBody }>,
    reply: FastifyReply,
) => {
    try {
        const validationResult = registerSchema.safeParse(request.body);
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

        const { firstName, lastName, email, password } = validationResult.data;

        // Check if the email is already registered
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return reply.code(409).send({ error: "Email already in use" });
        }

        // Hash the password before saving to the database
        const hashedPassword = bcrypt.hashSync(password, 10);

        await prisma.user.create({
            data: {
                fname: firstName,
                lname: lastName,
                email,
                password: hashedPassword,
            },
        });

        return reply.send({ message: "User registered successfully" });
    } catch (error: any) {
        console.error("Error in registerController:", error);
        reply
            .code(500)
            .send({ error: "Internal Server Error", message: error.message });
    }
};

export default registerController;