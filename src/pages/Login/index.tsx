import { HeaderForm } from "@/components/form/header-form";
import { LoginForm } from "@/components/form/login-form";
import { LeftSection } from "@/components/sections/left-section";
import { LoginRightSection } from "@/components/sections/login-right-section";

export function LoginPage() {
    return (
        <div className="flex min-h-screen w-full bg-[var(--background)]">
            <LeftSection>
                <div className="flex flex-col gap-5">
                    <HeaderForm
                        title="Bem-vindo!"
                        description="Entre com sua conta para gerenciar suas skills."
                    />
                    <LoginForm />
                </div>
            </LeftSection>
            <LoginRightSection />
        </div>
    );
}
