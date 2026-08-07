import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { SkillOption } from "@/services/skills-api";

type AddSkillModalProps = {
    options: SkillOption[];
    onClose: () => void;
    onSave: (skillId: string, level: number) => Promise<void>;
};

export function AddSkillModal({
    options,
    onClose,
    onSave,
}: AddSkillModalProps) {
    const [skillId, setSkillId] = useState(options[0]?.id ?? "");
    const [level, setLevel] = useState(1);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const handleSave = async () => {
        if (!skillId) return;
        setSaving(true);
        setError("");
        try {
            await onSave(skillId, level);
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
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Adicionar Skill"
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-[400px] flex-col gap-[18px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-[26px]"
            >
                <div className="text-[17px] font-bold text-[var(--foreground)]">
                    Adicionar Skill
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="modal-skill"
                        className="text-[13px] text-[var(--muted-foreground)]"
                    >
                        Skill
                    </label>
                    <select
                        id="modal-skill"
                        value={skillId}
                        onChange={(e) => setSkillId(e.target.value)}
                        className="w-full rounded-[9px] border border-[var(--border)] bg-[var(--input-bg-nested)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none"
                    >
                        {options.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="modal-level"
                        className="text-[13px] text-[var(--muted-foreground)]"
                    >
                        Level inicial
                    </label>
                    <input
                        id="modal-level"
                        type="number"
                        min={1}
                        max={10}
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                        className="w-full rounded-[9px] border border-[var(--border)] bg-[var(--input-bg-nested)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none"
                    />
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
                        type="button"
                        disabled={!skillId || saving}
                        onClick={handleSave}
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
            </div>
        </div>
    );
}
