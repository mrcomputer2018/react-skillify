import { Link } from "react-router";

export function LandingHeroSection() {
    return (
        <section className="flex min-w-0 flex-1 flex-col gap-[22px]">
            <div className="flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span className="text-[13px] font-medium text-[var(--muted-foreground)]">
                    Gerencie suas habilidades
                </span>
            </div>

            <h1 className="m-0 text-[36px] leading-[1.08] font-extrabold tracking-tight text-[var(--foreground)] sm:text-[44px] lg:text-[52px]">
                Organize e evolua
                <br />
                suas <span className="text-[var(--primary)]">skills</span> em
                um só lugar.
            </h1>

            <p className="m-0 max-w-[460px] text-[17px] leading-relaxed text-[var(--muted-foreground)]">
                O Skillify ajuda você a catalogar suas habilidades,
                acompanhar seu nível de domínio em cada uma e visualizar sua
                evolução ao longo do tempo.
            </p>

            <div className="mt-2.5 flex items-center gap-4">
                <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-[10px] bg-[var(--primary)] px-7 py-3.5 text-[15px] font-bold text-white no-underline hover:bg-[var(--primary-hover)]"
                >
                    Começar agora
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M5 12h14M13 6l6 6-6 6"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
                <Link
                    to="/login"
                    className="text-[15px] font-medium text-[var(--muted-foreground)] no-underline"
                >
                    Já tenho conta →
                </Link>
            </div>

            <div className="mt-7 flex gap-8 border-t border-[var(--border)] pt-7">
                <div>
                    <div className="text-[22px] font-bold text-[var(--foreground)]">
                        +40
                    </div>
                    <div className="text-[13px] text-[var(--muted-foreground)]">
                        skills catalogadas
                    </div>
                </div>
                <div>
                    <div className="text-[22px] font-bold text-[var(--foreground)]">
                        100%
                    </div>
                    <div className="text-[13px] text-[var(--muted-foreground)]">
                        gratuito
                    </div>
                </div>
                <div>
                    <div className="text-[22px] font-bold text-[var(--foreground)]">
                        Sync
                    </div>
                    <div className="text-[13px] text-[var(--muted-foreground)]">
                        em qualquer dispositivo
                    </div>
                </div>
            </div>
        </section>
    );
}
