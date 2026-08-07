import { z } from "zod";

export const CadastroSchema = z
    .object({
        usuario: z
            .string()
            .min(1, { message: "Escolha um nome de usuário." }),
        senha: z
            .string()
            .min(4, { message: "A senha deve ter no mínimo 4 caracteres." }),
        confirmarSenha: z
            .string()
            .min(1, { message: "Confirme sua senha." }),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        message: "As senhas não coincidem.",
        path: ["confirmarSenha"],
    });

export type CadastroFormData = z.infer<typeof CadastroSchema>;
