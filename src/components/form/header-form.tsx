import type { HeaderFormProps } from "./types";

export function HeaderForm({ title, description }: HeaderFormProps) {
    return (
        <div>
            <div className="mb-1.5 text-2xl font-extrabold text-[var(--foreground)]">
                {title}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">
                {description}
            </div>
        </div>
    );
}
