import { HeaderForm } from "../form/header-form";
import { LoginForm } from "../form/login-form";

export function LoginRightSection() {
    return (
        <section className="flex w-full flex-col bg-[--color-paper] px-6 py-8 sm:px-10 sm:py-10 lg:min-h-screen lg:w-1/2 lg:px-16 lg:py-12">
            <div className="flex flex-1 items-center justify-center py-10 sm:py-12">
                <div className="w-full max-w-sm space-y-8">
                    <HeaderForm
                        title="Bem-vindo de volta"
                        description="Insira seu e-mail e senha para entrar."
                    />

                    <LoginForm />
                </div>
            </div>
        </section>
    );
}
