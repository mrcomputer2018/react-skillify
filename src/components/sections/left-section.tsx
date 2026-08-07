import registerImage from "@/assets/hero.png";

export function LeftSection() {
    return (
        <section className="relative min-h-90 overflow-hidden lg:min-h-screen w-1/2">
            <img
                src={registerImage}
                alt="imagem de uma habilidade"
                className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,32,0.16)_0%,rgba(18,24,32,0.18)_45%,rgba(18,24,32,0.72)_100%)]" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10 text-left">
                <div className="max-w-xl space-y-4 text-white">
                    <h1 className="max-w-md text-xl font-semibold leading-none tracking-[-0.04em] sm:text-2xl lg:text-4xl">
                        Desenvolva suas habilidades.
                    </h1>
                    <p className="max-w-md text-sm leading-6 text-white/78 sm:text-base">
                        Cadastre-se e comece a listar suas habilidades.
                    </p>
                </div>
            </div>
        </section>
    );
}
