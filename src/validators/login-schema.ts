import { z } from "zod";

export const LoginSchema = z.object({
    email: z.email({ message: "Informe um e-mail válido." }),
    senha: z
        .string()
        .min(1, { message: "A senha é obrigatória." })
        .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
