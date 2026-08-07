export function SkillsSkeleton() {
    return (
        <div className="flex flex-col gap-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="h-[88px] animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)]"
                />
            ))}
        </div>
    );
}
