import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UserSkill } from "@/services/skills-api";
import { SkillSchema, type SkillFormData } from "@/validators/skill-schema";

type AddSkillModalProps = {
    skill?: UserSkill;
    onClose: () => void;
    onSave: (data: SkillFormData) => Promise<void>;
};

export function AddSkillModal({ skill, onClose, onSave }: AddSkillModalProps) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const isEditing = !!skill;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SkillFormData>({
        resolver: zodResolver(SkillSchema),
        mode: "onBlur",
        defaultValues: {
            imgUrl: skill?.imgUrl ?? "",
            nome: skill?.nome ?? "",
            descricao: skill?.descricao ?? "",
            level: skill?.level ?? 1,
        },
    });

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const onSubmit = async (data: SkillFormData) => {
        setSaving(true);
        setError("");
        try {
            await onSave(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao salvar.");
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65"
            onClick={onClose}
        >
            <form
                role="dialog"
                aria-modal="true"
                aria-label={isEditing ? "Editar Skill" : "Cadastrar Skill"}
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex w-full max-w-[400px] flex-col gap-[18px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-[26px]"
            >
                <div className="text-[17px] font-bold text-[var(--foreground)]">
                    {isEditing ? "Editar Skill" : "Cadastrar Skill"}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="modal-imgUrl"
                        className="text-[13px] text-[var(--muted-foreground)]"
                    >
                        URL da imagem (opcional)
                    </Label>
                    <Input
                        id="modal-imgUrl"
                        type="text"
                        placeholder="https://..."
                        aria-invalid={!!errors.imgUrl}
                        aria-describedby="modal-imgUrl-message"
                        className="h-11 rounded-[9px] border-[var(--border)] bg-[var(--input-bg-nested)] text-sm text-[var(--foreground)] focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30"
                        {...register("imgUrl")}
                    />
                    {errors.imgUrl && (
                        <p
                            id="modal-imgUrl-message"
                            className="text-xs text-[var(--destructive)]"
                        >
                            {errors.imgUrl.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="modal-nome"
                        className="text-[13px] text-[var(--muted-foreground)]"
                    >
                        Nome
                    </Label>
                    <Input
                        id="modal-nome"
                        type="text"
                        placeholder="Nome da skill"
                        aria-invalid={!!errors.nome}
                        aria-describedby="modal-nome-message"
                        className="h-11 rounded-[9px] border-[var(--border)] bg-[var(--input-bg-nested)] text-sm text-[var(--foreground)] focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30"
                        {...register("nome")}
                    />
                    {errors.nome && (
                        <p
                            id="modal-nome-message"
                            className="text-xs text-[var(--destructive)]"
                        >
                            {errors.nome.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="modal-descricao"
                        className="text-[13px] text-[var(--muted-foreground)]"
                    >
                        Descrição
                    </Label>
                    <Textarea
                        id="modal-descricao"
                        placeholder="Descreva a skill"
                        aria-invalid={!!errors.descricao}
                        aria-describedby="modal-descricao-message"
                        className="min-h-[80px] rounded-[9px] border-[var(--border)] bg-[var(--input-bg-nested)] text-sm text-[var(--foreground)] focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30"
                        {...register("descricao")}
                    />
                    {errors.descricao && (
                        <p
                            id="modal-descricao-message"
                            className="text-xs text-[var(--destructive)]"
                        >
                            {errors.descricao.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="modal-level"
                        className="text-[13px] text-[var(--muted-foreground)]"
                    >
                        Level inicial
                    </Label>
                    <Input
                        id="modal-level"
                        type="number"
                        min={1}
                        max={10}
                        aria-invalid={!!errors.level}
                        aria-describedby="modal-level-message"
                        className="h-11 rounded-[9px] border-[var(--border)] bg-[var(--input-bg-nested)] text-sm text-[var(--foreground)] focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30"
                        {...register("level", { valueAsNumber: true })}
                    />
                    {errors.level && (
                        <p
                            id="modal-level-message"
                            className="text-xs text-[var(--destructive)]"
                        >
                            {errors.level.message}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="rounded-lg border border-[var(--destructive-border)] bg-[var(--destructive-bg)] px-3 py-2.5 text-[13px] text-[var(--destructive)]">
                        {error}
                    </div>
                )}

                <div className="mt-1 flex gap-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="h-11 flex-1 rounded-[9px] border-[var(--border)] bg-transparent text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--input-bg-nested)]"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[9px] bg-[var(--primary)] text-sm font-bold text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
                    >
                        {saving && (
                            <span
                                aria-hidden="true"
                                className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                            />
                        )}
                        Salvar
                    </Button>
                </div>
            </form>
        </div>
    );
}
