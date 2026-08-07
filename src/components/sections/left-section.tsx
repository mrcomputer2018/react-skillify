export function LeftSection() {
    return (
        <section className="relative isolate flex min-h-[45vh] w-full flex-col justify-end overflow-hidden bg-[var(--color-panel)] px-6 py-10 text-[var(--color-panel-ink)] sm:px-10 sm:py-12 lg:min-h-screen lg:w-1/2 lg:px-14 lg:py-16">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(120% 90% at 18% 8%, color-mix(in oklch, var(--color-panel-2) 100%, transparent) 0%, transparent 55%), radial-gradient(90% 70% at 88% 96%, color-mix(in oklch, var(--color-accent) 22%, var(--color-panel)) 0%, var(--color-panel) 60%)",
                }}
            />

            <svg
                aria-hidden="true"
                viewBox="0 0 60 120"
                className="mb-8 h-24 w-12 text-[--color-accent] sm:h-28 sm:w-14"
            >
                <path
                    className="fill-none stroke-current"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    d="M 30 114 Q 27 84 31.5 54 Q 33 33 30 12"
                />
                <g transform="translate(12 57) rotate(-25)">
                    <ellipse
                        className="fill-none stroke-current"
                        strokeWidth="1.6"
                        cx="0"
                        cy="0"
                        rx="9"
                        ry="16.5"
                    />
                    <path
                        className="fill-none stroke-current opacity-60"
                        strokeWidth="1"
                        strokeLinecap="round"
                        d="M 0 -15 Q 1.5 0 0 15"
                    />
                </g>
                <g transform="translate(42 78) rotate(30)">
                    <ellipse
                        className="fill-none stroke-current"
                        strokeWidth="1.6"
                        cx="0"
                        cy="0"
                        rx="9"
                        ry="16.5"
                    />
                    <path
                        className="fill-none stroke-current opacity-60"
                        strokeWidth="1"
                        strokeLinecap="round"
                        d="M 0 -15 Q -1.5 0 0 15"
                    />
                </g>
                <path
                    className="fill-none stroke-current"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    d="M 30 33 Q 24 28.5 19.5 33"
                />
            </svg>

            <div className="max-w-md space-y-4">
                <h1
                    className="text-[length:var(--text-display)] leading-[1.05] font-semibold tracking-[-0.02em]"
                    style={{
                        fontFamily: "var(--font-display)",
                        overflowWrap: "anywhere",
                        minWidth: 0,
                    }}
                >
                    Desenvolva suas habilidades.
                </h1>
                <p className="max-w-sm text-[length:var(--text-md)] leading-relaxed text-[var(--color-panel-ink-2)]">
                    Cadastre-se e comece a listar suas habilidades com a
                    SkillCrud.
                </p>
            </div>
        </section>
    );
}
