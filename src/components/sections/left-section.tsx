import type { ReactNode } from "react";

export function LeftSection({ children }: { children: ReactNode }) {
    return (
        <section className="flex w-full flex-1 items-center justify-center p-6 sm:p-10">
            <div className="flex w-full max-w-[360px] flex-col gap-6">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#ffffff"
                        >
                            <polygon points="13,2 3,14 11,14 9,22 21,9 13,9" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold text-[var(--foreground)]">
                        Skillify
                    </span>
                </div>

                {children}
            </div>
        </section>
    );
}
