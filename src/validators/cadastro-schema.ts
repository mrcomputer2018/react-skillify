import { z } from "zod";

export const CadastroSchema = z
    .object({
        usuario: z
            .string()
            .min(4, { message: "O usuário deve ter no mínimo 4 caracteres." })
            .max(50, { message: "O usuário deve ter no máximo 50 caracteres." }),
        senha: z
            .string()
            .min(6, { message: "A senha deve ter no mínimo 6 caracteres." })
            .max(100, { message: "A senha deve ter no máximo 100 caracteres." }),
        confirmarSenha: z
            .string()
            .min(1, { message: "Confirme sua senha." }),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        message: "As senhas não coincidem.",
        path: ["confirmarSenha"],
    });

export type CadastroFormData = z.infer<typeof CadastroSchema>;
