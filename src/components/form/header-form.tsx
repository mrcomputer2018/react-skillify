import type { HeaderFormProps } from "./types";

export function HeaderForm({ title, description }: HeaderFormProps) {
    return (
        <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
