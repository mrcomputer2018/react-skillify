import { z } from "zod";

export const SkillSchema = z.object({
    imgUrl: z
        .string()
        .trim()
        .url({ message: "Informe uma URL válida." })
        .optional()
        .or(z.literal("")),
    nome: z.string().trim().min(1, { message: "Informe o nome da skill." }),
    descricao: z
        .string()
        .trim()
        .min(1, { message: "Informe a descrição da skill." }),
    level: z
        .number({ message: "Informe o level." })
        .min(1, { message: "O level mínimo é 1." })
        .max(10, { message: "O level máximo é 10." }),
});

export type SkillFormData = z.infer<typeof SkillSchema>;
