import authPanel from "@/assets/auth-panel.jpg";

export function LoginRightSection() {
    return (
        <section className="hidden shrink-0 basis-[55%] p-6 pl-0 lg:flex lg:items-center lg:justify-center">
            <div className="h-full w-full overflow-hidden rounded-3xl bg-[#d9e4e1]">
                <img
                    src={authPanel}
                    alt="Folhas azuis sobre fundo escuro"
                    width={1920}
                    height={1280}
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                />
            </div>
        </section>
    );
}
