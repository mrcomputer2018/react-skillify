import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    listarCatalogoSkills,
    type SkillOption,
    type UserSkill,
} from "@/services/skills-api";
import { SkillSchema, type SkillFormData } from "@/validators/skill-schema";

type AddSkillModalProps = {
    skill?: UserSkill;
    onClose: () => void;
    onSave: (data: SkillFormData) => Promise<void>;
};

export function AddSkillModal({ skill, onClose, onSave }: AddSkillModalProps) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [catalog, setCatalog] = useState<SkillOption[]>([]);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const isEditing = !!skill;

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SkillFormData>({
        resolver: zodResolver(SkillSchema),
        mode: "onBlur",
        defaultValues: {
            skillId: skill?.skillId ?? 0,
            level: skill?.level ?? 1,
        },
    });

    useEffect(() => {
        listarCatalogoSkills()
            .then(setCatalog)
            .finally(() => setCatalogLoading(false));
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const selectedSkillId = watch("skillId");
    const selectedSkill =
        catalog.find((s) => s.id === selectedSkillId) ??
        (skill
            ? { id: skill.skillId, nome: skill.nome, descricao: skill.descricao, imgUrl: skill.imgUrl }
            : undefined);

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
                        htmlFor="modal-skillId"
                        className="text-[13px] text-[var(--muted-foreground)]"
                    >
                        Skill
                    </Label>
                    <Controller
                        control={control}
                        name="skillId"
                        render={({ field }) => (
                            <Select
                                value={field.value ? String(field.value) : ""}
                                onValueChange={(value) =>
                                    field.onChange(Number(value))
                                }
                                disabled={isEditing || catalogLoading}
                            >
                                <SelectTrigger
                                    id="modal-skillId"
                                    className="h-11 w-full rounded-[9px] border-[var(--border)] bg-[var(--input-bg-nested)] text-sm text-[var(--foreground)]"
                                    aria-invalid={!!errors.skillId}
                                >
                                    <SelectValue
                                        placeholder={
                                            catalogLoading
                                                ? "Carregando skills..."
                                                : "Selecione uma skill"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {catalog.map((option) => (
                                        <SelectItem
                                            key={option.id}
                                            value={String(option.id)}
                                        >
                                            {option.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.skillId && (
                        <p className="text-xs text-[var(--destructive)]">
                            {errors.skillId.message}
                        </p>
                    )}
                </div>

                {selectedSkill && (
                    <p className="text-[13px] text-[var(--muted-foreground)]">
                        {selectedSkill.descricao}
                    </p>
                )}

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="modal-level"
                        className="text-[13px] text-[var(--muted-foreground)]"
                    >
                        Level
                    </Label>
                    <Input
                        id="modal-level"
                        type="number"
                        min={1}
                        max={5}
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
