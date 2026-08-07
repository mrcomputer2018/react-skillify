import { z } from "zod";

export const LoginSchema = z.object({
    usuario: z.string().min(1, { message: "Informe seu nome de usuário." }),
    senha: z
        .string()
        .min(1, { message: "A senha é obrigatória." })
        .min(4, { message: "A senha deve ter no mínimo 4 caracteres." }),
    gravarSenha: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
