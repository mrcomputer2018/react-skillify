import { Minus, Plus, Trash2 } from "lucide-react";

import { getSkillColor } from "@/lib/skill-color";
import type { UserSkill } from "@/services/skills-api";

type SkillRowProps = {
    skill: UserSkill;
    confirming: boolean;
    onIncLevel: () => void;
    onDecLevel: () => void;
    onAskDelete: () => void;
    onCancelDelete: () => void;
    onConfirmDelete: () => void;
};

export function SkillRow({
    skill,
    confirming,
    onIncLevel,
    onDecLevel,
    onAskDelete,
    onCancelDelete,
    onConfirmDelete,
}: SkillRowProps) {
    return (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex min-w-0 flex-1 basis-[200px] items-center gap-4">
                <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-[10px] font-mono text-base font-extrabold text-white"
                    style={{ background: getSkillColor(skill.id) }}
                >
                    {skill.nome.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-bold text-[var(--foreground)]">
                        {skill.nome}
                    </div>
                    <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-[var(--muted-foreground)]">
                        {skill.descricao}
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg-nested)] p-1">
                <button
                    type="button"
                    aria-label="Diminuir level"
                    onClick={onDecLevel}
                    className="flex size-[26px] items-center justify-center rounded-md text-lg text-[var(--foreground)] hover:bg-[var(--border)]"
                >
                    <Minus className="size-3.5" />
                </button>
                <span className="min-w-[38px] text-center text-[13px] font-bold text-[var(--foreground)]">
                    Lvl {skill.level}
                </span>
                <button
                    type="button"
                    aria-label="Aumentar level"
                    onClick={onIncLevel}
                    className="flex size-[26px] items-center justify-center rounded-md text-lg text-[var(--foreground)] hover:bg-[var(--border)]"
                >
                    <Plus className="size-3.5" />
                </button>
            </div>

            {confirming ? (
                <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-xs text-[var(--muted-foreground)]">
                        Excluir?
                    </span>
                    <button
                        type="button"
                        onClick={onConfirmDelete}
                        className="rounded-md border border-[var(--destructive-border)] bg-[var(--destructive-bg)] px-2.5 py-1.5 text-xs font-bold text-[var(--destructive)]"
                    >
                        Sim
                    </button>
                    <button
                        type="button"
                        onClick={onCancelDelete}
                        className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--muted-foreground)]"
                    >
                        Não
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    aria-label="Excluir skill"
                    onClick={onAskDelete}
                    className="flex size-[34px] shrink-0 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--destructive-bg)] hover:text-[var(--destructive)]"
                >
                    <Trash2 className="size-4" />
                </button>
            )}
        </div>
    );
}
