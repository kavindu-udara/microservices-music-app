import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@packages/shared/prisma";
import bcrypt from "bcryptjs";

type RegisterRequestBody = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export const registerController = async (request: FastifyRequest<{Body : RegisterRequestBody}>, reply: FastifyReply) => {
    try {
        const { firstname, lastname, email, password } = request.body;

        if (!firstname || !lastname || !email || !password) {
            return reply.code(400).send({ error: "All fields are required" });
        }

        // Check if the email is already registered
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return reply.code(409).send({ error: "Email already in use" });
        }

        // Hash the password before saving to the database
        const hashedPassword = bcrypt.hashSync(password, 10); 

        const user = await prisma.user.create({
            data : {
                fname: firstname,
                lname :lastname,
                email ,
                password : hashedPassword 
            }
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