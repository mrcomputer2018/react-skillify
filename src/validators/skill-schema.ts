import { z } from "zod";

export const SkillSchema = z.object({
    skillId: z
        .number({ message: "Selecione uma skill." })
        .int()
        .positive({ message: "Selecione uma skill." }),
    level: z
        .number({ message: "Informe o level." })
        .min(1, { message: "O level mínimo é 1." })
        .max(5, { message: "O level máximo é 5." }),
});

export type SkillFormData = z.infer<typeof SkillSchema>;
