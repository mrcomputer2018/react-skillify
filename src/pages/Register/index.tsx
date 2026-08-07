import { HeaderForm } from "@/components/form/header-form";
import { RegisterForm } from "@/components/form/register-form";
import { LeftSection } from "@/components/sections/left-section";
import { LoginRightSection } from "@/components/sections/login-right-section";

export function RegisterPage() {
    return (
        <div className="flex min-h-screen w-full bg-[var(--background)]">
            <LeftSection>
                <div className="flex flex-col gap-5">
                    <HeaderForm
                        title="Criar conta"
                        description="Cadastre-se para começar a gerenciar suas skills."
                    />
                    <RegisterForm />
                </div>
            </LeftSection>
            <LoginRightSection />
        </div>
    );
}
