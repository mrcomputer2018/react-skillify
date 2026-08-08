const PREVIEW_SKILLS = [
    { name: "React Native", level: "Nível 4", progress: 80 },
    { name: "TypeScript", level: "Nível 3", progress: 60 },
    { name: "UI Design", level: "Nível 5", progress: 95 },
];

export function LandingPreviewSection() {
    return (
        <section className="relative flex min-w-0 flex-1 items-center justify-center">
            <div className="absolute h-[340px] w-[340px] rounded-full bg-[var(--primary)] opacity-[0.18] blur-[60px]" />

            <div className="relative w-full max-w-[420px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
                <div className="mb-[18px] flex items-center justify-between">
                    <div>
                        <div className="text-base font-bold text-[var(--foreground)]">
                            Minhas Skills
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                            Gerencie seu perfil
                        </div>
                    </div>
                    <div className="flex items-center gap-[5px] rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M12 5v14M5 12h14"
                                stroke="#FFFFFF"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        Adicionar
                    </div>
                </div>

                <div className="flex flex-col gap-2.5">
                    {PREVIEW_SKILLS.map((skill) => (
                        <div
                            key={skill.name}
                            className="flex items-center gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--background)] p-3"
                        >
                            <div className="h-[38px] w-[38px] shrink-0 rounded-[9px] bg-[var(--border)]" />
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-[var(--foreground)]">
                                    {skill.name}
                                </div>
                                <div className="text-xs text-[var(--muted-foreground)]">
                                    {skill.level}
                                </div>
                            </div>
                            <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-[var(--border)]">
                                <div
                                    className="h-full bg-[var(--primary)]"
                                    style={{ width: `${skill.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
