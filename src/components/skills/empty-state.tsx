import { Sparkles } from "lucide-react";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center gap-3.5 rounded-2xl border border-dashed border-[var(--border)] px-5 py-[70px] text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--card)]">
                <Sparkles className="size-6 text-[var(--primary)]" />
            </div>
            <div className="text-[17px] font-bold text-[var(--foreground)]">
                Nenhuma skill adicionada ainda
            </div>
            <div className="max-w-[320px] text-[13px] text-[var(--muted-foreground)]">
                Comece a construir seu perfil adicionando as habilidades que
                você domina.
            </div>
            <button
                type="button"
                onClick={onAdd}
                className="mt-1.5 rounded-[9px] bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--primary-hover)]"
            >
                Adicionar primeira skill
            </button>
        </div>
    );
}
