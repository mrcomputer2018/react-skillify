import loginHero from "@/assets/login-hero.jpg";

export function LeftSection() {
    return (
        <section className="relative isolate flex min-h-[45vh] w-full flex-col justify-end overflow-hidden bg-[--color-panel] px-6 py-10 text-[--color-panel-ink] sm:px-10 sm:py-12 lg:min-h-screen lg:w-1/2 lg:px-14 lg:py-16">
            <img
                src={loginHero}
                alt="Mãos entalhando um padrão circular em uma peça de madeira, à luz de uma bancada de trabalho"
                width={1920}
                height={1280}
                fetchPriority="high"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
                style={{ objectPosition: "60% 45%" }}
            />

            <div className="max-w-md space-y-4">
                <h1
                    className="text-(length:--text-display) leading-[1.05] font-semibold tracking-[-0.02em] text-gray-50"
                    style={{
                        fontFamily: "var(--font-display)",
                        overflowWrap: "anywhere",
                        minWidth: 0,
                    }}
                >
                    Desenvolva suas habilidades.
                </h1>
                <p className="max-w-sm text-[length:var(--text-md)] leading-relaxed text-gray-300">
                    Cadastre-se e comece a listar suas habilidades com a
                    SkillCrud.
                </p>
            </div>
        </section>
    );
}

