import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/contexts/toastContext";
import { cadastrar } from "@/services/skills-api";
import {
    CadastroSchema,
    type CadastroFormData,
} from "@/validators/cadastro-schema";

export function RegisterForm() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isSenhaVisible, setIsSenhaVisible] = useState(false);
    const [isConfirmarVisible, setIsConfirmarVisible] = useState(false);
    const [cadastroError, setCadastroError] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CadastroFormData>({
        resolver: zodResolver(CadastroSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: CadastroFormData) => {
        setCadastroError("");
        setLoading(true);
        try {
            await cadastrar(data.usuario, data.senha);
            showToast("success", "Cadastro realizado com sucesso!");
            navigate("/login");
        } catch (e) {
            setCadastroError(
                e instanceof Error ? e.message : "Erro ao cadastrar.",
            );
            setLoading(false);
        }
    };

    return (
        <form
            className="flex flex-col gap-3.5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <div className="flex flex-col gap-1.5">
                <Label
                    htmlFor="usuario"
                    className="text-[13px] text-[var(--muted-foreground)]"
                >
                    Nome de usuário
                </Label>
                <div className="relative flex items-center">
                    <User
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 size-4 text-[var(--muted-foreground)]"
                    />
                    <Input
                        id="usuario"
                        type="text"
                        placeholder="Escolha um nome de usuário"
                        aria-invalid={!!errors.usuario}
                        aria-describedby="usuario-message"
                        className="h-11 rounded-[9px] border-[var(--border)] bg-[var(--input-bg)] pl-10 text-[14px] text-[var(--foreground)] focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30"
                        {...register("usuario")}
                    />
                </div>
                {errors.usuario && (
                    <p
                        id="usuario-message"
                        className="text-xs text-[var(--destructive)]"
                    >
                        {errors.usuario.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label
                    htmlFor="senha"
                    className="text-[13px] text-[var(--muted-foreground)]"
                >
                    Senha
                </Label>
                <div className="relative flex items-center">
                    <Lock
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 size-4 text-[var(--muted-foreground)]"
                    />
                    <Input
                        id="senha"
                        type={isSenhaVisible ? "text" : "password"}
                        placeholder="Crie uma senha"
                        aria-invalid={!!errors.senha}
                        aria-describedby="senha-message"
                        className="h-11 rounded-[9px] border-[var(--border)] bg-[var(--input-bg)] px-10 text-[14px] text-[var(--foreground)] focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30"
                        {...register("senha")}
                    />
                    <button
                        type="button"
                        aria-label={
                            isSenhaVisible ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() => setIsSenhaVisible((v) => !v)}
                        className="absolute right-3 flex size-4 items-center justify-center text-[var(--muted-foreground)]"
                    >
                        {isSenhaVisible ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </button>
                </div>
                {errors.senha && (
                    <p
                        id="senha-message"
                        className="text-xs text-[var(--destructive)]"
                    >
                        {errors.senha.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label
                    htmlFor="confirmarSenha"
                    className="text-[13px] text-[var(--muted-foreground)]"
                >
                    Confirmar senha
                </Label>
                <div className="relative flex items-center">
                    <Lock
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 size-4 text-[var(--muted-foreground)]"
                    />
                    <Input
                        id="confirmarSenha"
                        type={isConfirmarVisible ? "text" : "password"}
                        placeholder="Repita a senha"
                        aria-invalid={!!errors.confirmarSenha}
                        aria-describedby="confirmar-message"
                        className="h-11 rounded-[9px] border-[var(--border)] bg-[var(--input-bg)] px-10 text-[14px] text-[var(--foreground)] focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30"
                        {...register("confirmarSenha")}
                    />
                    <button
                        type="button"
                        aria-label={
                            isConfirmarVisible
                                ? "Ocultar senha"
                                : "Mostrar senha"
                        }
                        onClick={() => setIsConfirmarVisible((v) => !v)}
                        className="absolute right-3 flex size-4 items-center justify-center text-[var(--muted-foreground)]"
                    >
                        {isConfirmarVisible ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </button>
                </div>
                {errors.confirmarSenha && (
                    <p
                        id="confirmar-message"
                        className="text-xs text-[var(--destructive)]"
                    >
                        {errors.confirmarSenha.message}
                    </p>
                )}
            </div>

            {cadastroError && (
                <div className="rounded-lg border border-[var(--destructive-border)] bg-[var(--destructive-bg)] px-3 py-2.5 text-[13px] text-[var(--destructive)]">
                    {cadastroError}
                </div>
            )}

            <Button
                type="submit"
                disabled={loading}
                className="mt-1 flex h-[46px] w-full items-center justify-center gap-2 rounded-[9px] bg-[var(--primary)] text-[15px] font-bold text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
            >
                {loading && (
                    <span
                        aria-hidden="true"
                        className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                )}
                Salvar
            </Button>

            <div className="text-center text-[13px] text-[var(--muted-foreground)]">
                Já tem conta?{" "}
                <Link
                    to="/login"
                    className="text-[var(--primary-hover)] hover:underline"
                >
                    Voltar ao login
                </Link>
            </div>
        </form>
    );
}
