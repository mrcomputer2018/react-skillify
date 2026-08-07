import { zodResolver } from "@hookform/resolvers/zod";
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
    });

    const onSubmit = (data: LoginFormData) => {
        console.log(data);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-sm text-destructive">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                    id="senha"
                    type="password"
                    placeholder="********"
                    aria-invalid={!!errors.senha}
                    {...register("senha")}
                />
                {errors.senha && (
                    <p className="text-sm text-destructive">
                        {errors.senha.message}
                    </p>
                )}
            </div>

            <Button type="submit" className="w-full">
                Entrar
            </Button>
        </form>
    );
}
