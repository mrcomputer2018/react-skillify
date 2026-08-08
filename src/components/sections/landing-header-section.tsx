import { Link } from "react-router";
import { ModeToggle } from "../mode-toggle";

export function LandingHeaderSection() {
    return (
        <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-6 sm:px-12">
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
            <div className="flex items-center gap-[18px]">
                <ModeToggle />
                <Link
                    to="/login"
                    className="rounded-lg border border-[var(--border)] bg-[#eaf1ff] px-4 py-2.5 text-[13px] font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[#dce8ff] dark:bg-transparent dark:hover:bg-[var(--input-bg-nested)]"
                >
                    Entrar
                </Link>
            </div>
        </header>
    );
}
