import { LandingFooterSection } from "@/components/sections/landing-footer-section";
import { LandingHeaderSection } from "@/components/sections/landing-header-section";
import { LandingHeroSection } from "@/components/sections/landing-hero-section";
import { LandingPreviewSection } from "@/components/sections/landing-preview-section";

export function LandingPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-[var(--background)] text-[var(--foreground)]">
            <LandingHeaderSection />

            <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center gap-16 px-6 py-10 pb-20 sm:px-12 lg:flex-row">
                <LandingHeroSection />
                <LandingPreviewSection />
            </main>

            <LandingFooterSection />
        </div>
    );
}
