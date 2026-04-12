import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .regex(/^[a-zA-Z]+$/, "First name should only contain letters"),
  lastName: z
    .string()
    .regex(/^[a-zA-Z]+$/, "Last name should only contain letters"),
  email: z
    .string()
    .email("Invalid email format")
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters long")
    .optional(),
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
