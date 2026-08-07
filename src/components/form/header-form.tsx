import type { HeaderFormProps } from "./types";

export function HeaderForm({ title, description }: HeaderFormProps) {
    return (
        <div className="space-y-2">
            <h2
                className="text-[length:var(--text-2xl)] leading-tight font-semibold tracking-[-0.01em] text-[var(--color-ink)]"
                style={{ fontFamily: "var(--font-display)" }}
            >
                {title}
            </h2>
            <p className="text-[length:var(--text-sm)] leading-relaxed text-[var(--color-muted)]">
                {description}
            </p>
        </div>
    );
}
