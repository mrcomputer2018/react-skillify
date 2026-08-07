import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LoginSchema, type LoginFormData } from "../../validators/login-schema";

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        mode: "onBlur",
    });

    const onSubmit = (data: LoginFormData) => {
        console.log(data);
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-1.5">
                <Label
                    htmlFor="email"
                    className="text-[length:var(--text-sm)] font-medium text-[var(--color-ink-2)]"
                >
                    E-mail
                </Label>
                <div className="relative">
                    <Input
                        id="email"
                        type="email"
                        placeholder="voce@exemplo.com"
                        aria-invalid={!!errors.email}
                        aria-describedby="email-message"
                        className="h-11 rounded-[var(--radius-input)] pr-9 transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)]"
                        {...register("email")}
                    />
                    {errors.email && (
                        <TriangleAlert
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[var(--color-error)]"
                        />
                    )}
                </div>
                <p
                    id="email-message"
                    className="min-h-[1lh] text-[length:var(--text-xs)] text-[var(--color-error)]"
                >
                    {errors.email?.message ?? ""}
                </p>
            </div>

            <div className="space-y-1.5">
                <Label
                    htmlFor="senha"
                    className="text-[length:var(--text-sm)] font-medium text-[var(--color-ink-2)]"
                >
                    Senha
                </Label>
                <div className="relative">
                    <Input
                        id="senha"
                        type="password"
                        placeholder="********"
                        aria-invalid={!!errors.senha}
                        aria-describedby="senha-message"
                        className="h-11 rounded-[var(--radius-input)] pr-9 transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)]"
                        {...register("senha")}
                    />
                    {errors.senha && (
                        <TriangleAlert
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[var(--color-error)]"
                        />
                    )}
                </div>
                <p
                    id="senha-message"
                    className="min-h-[1lh] text-[length:var(--text-xs)] text-[var(--color-error)]"
                >
                    {errors.senha?.message ?? ""}
                </p>
            </div>

            <Button
                type="submit"
                className="h-11 w-full rounded-[var(--radius-button)] text-[length:var(--text-sm)] transition-[background-color,transform] duration-[var(--dur-short)] ease-[var(--ease-out)]"
            >
                Entrar
            </Button>
        </form>
    );
}
