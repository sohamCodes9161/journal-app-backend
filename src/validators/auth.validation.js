import { z } from "zod";

const registerSchema = z.object({

    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username cannot exceed 30 characters"),

    email: z
        .email("Invalid email format"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({

    email: z
        .email("Invalid email format"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export {
    registerSchema,
    loginSchema,
};