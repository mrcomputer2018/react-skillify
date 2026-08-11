import { z } from "zod";

export const CreateSkillSchema = z.object({
    imgUrl: z
        .string()
        .url({ message: "Informe uma URL válida." })
        .optional()
        .or(z.literal("")),
    nome: z.string().min(1, { message: "Informe o nome da skill." }),
    descricao: z.string().min(1, { message: "Informe a descrição." }),
    level: z
        .number({ message: "Informe o level." })
        .min(1, { message: "O level mínimo é 1." })
        .max(5, { message: "O level máximo é 5." }),
});

export type CreateSkillFormData = z.infer<typeof CreateSkillSchema>;
