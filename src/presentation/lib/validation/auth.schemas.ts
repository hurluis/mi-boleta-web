import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener entre 2 y 80 caracteres")
      .max(80, "El nombre debe tener entre 2 y 80 caracteres"),
    email: z.string().email("El email no es válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
