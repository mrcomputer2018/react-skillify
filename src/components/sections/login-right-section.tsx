import { HeaderForm } from "../form/header-form";
import { LoginForm } from "../form/login-form";

export function LoginRightSection() {
    return (
        <section
            className={`flex items-center justify-center px-6 py-10 sm:px-10 lg:min-h-screen bg-[#F7F9FB] dark:bg-background w-1/2`}
        >
            <div className="w-full max-w-xl space-y-8 rounded-[2rem] border border-gray-300 bg-white p-6 shadow-[0_24px_80px_-48px_rgba(7,18,38,0.6)] sm:p-10 dark:border-border dark:bg-card text-left">
                <HeaderForm
                    title="Bem vindo de volta"
                    description="Insira seu e-mail e senha para entrar!"
                />

                <LoginForm />
            </div>
        </section>
    );
}
