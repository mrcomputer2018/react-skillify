import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, ShieldAlert, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/authContext";
import { getData, removeData, storeData } from "@/services/storage";
import { login as loginRequest } from "@/services/skills-api";
import { LoginSchema, type LoginFormData } from "@/validators/login-schema";

const SAVED_CREDENTIALS_KEY = "skills_saved_credentials";

export function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);

    const [showSavePasswordWarning, setShowSavePasswordWarning] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        mode: "onBlur",
        defaultValues: { usuario: "", senha: "", gravarSenha: false },
    });

    useEffect(() => {
        getData(SAVED_CREDENTIALS_KEY).then((saved) => {
            if (saved) {
                reset({
                    usuario: saved.usuario,
                    senha: saved.senha,
                    gravarSenha: true,
                });
            }
        });
    }, [reset]);

    const [usuario, senha] = watch(["usuario", "senha"]);
    const filled = Boolean(usuario && senha);

    const onSubmit = async (data: LoginFormData) => {
        setLoginError("");
        setLoading(true);
        try {
            const res = await loginRequest(data.usuario, data.senha);

            if (data.gravarSenha) {
                await storeData(SAVED_CREDENTIALS_KEY, {
                    usuario: data.usuario,
                    senha: data.senha,
                });
            } else {
                await removeData(SAVED_CREDENTIALS_KEY);
            }

            login({
                usuarioId: res.usuarioId,
                usuario: res.usuario,
                token: res.token,
            });
            navigate("/home");
        } catch (e) {
            setLoginError(e instanceof Error ? e.message : "Erro ao entrar.");
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
                        placeholder="Digite seu nome de usuário"
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
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Digite sua senha"
                        aria-invalid={!!errors.senha}
                        aria-describedby="senha-message"
                        className="h-11 rounded-[9px] border-[var(--border)] bg-[var(--input-bg)] px-10 text-[14px] text-[var(--foreground)] focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30"
                        {...register("senha")}
                    />
                    <button
                        type="button"
                        aria-label={
                            isPasswordVisible ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() => setIsPasswordVisible((v) => !v)}
                        className="absolute right-3 flex size-4 items-center justify-center text-[var(--muted-foreground)]"
                    >
                        {isPasswordVisible ? (
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

            <Controller
                control={control}
                name="gravarSenha"
                render={({ field }) => (
                    <label className="flex cursor-pointer items-center gap-2 select-none">
                        <input
                            type="checkbox"
                            className="size-[15px] cursor-pointer accent-[var(--primary)]"
                            checked={!!field.value}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setShowSavePasswordWarning(true);
                                } else {
                                    field.onChange(false);
                                    setValue("usuario", "");
                                    setValue("senha", "");
                                }
                            }}
                        />
                        <span className="text-[13px] text-[var(--muted-foreground)]">
                            Gravar senha
                        </span>
                    </label>
                )}
            />

            {loginError && (
                <div className="rounded-lg border border-[var(--destructive-border)] bg-[var(--destructive-bg)] px-3 py-2.5 text-[13px] text-[var(--destructive)]">
                    {loginError}
                </div>
            )}

            <Button
                type="submit"
                disabled={!filled || loading}
                className="mt-1 flex h-[46px] w-full items-center justify-center gap-2 rounded-[9px] bg-[var(--primary)] text-[15px] font-bold text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
            >
                {loading && (
                    <span
                        aria-hidden="true"
                        className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                )}
                Fazer login
            </Button>

            <div className="text-center text-[13px] text-[var(--muted-foreground)]">
                Não possui conta?{" "}
                <Link
                    to="/register"
                    className="text-[var(--primary-hover)] hover:underline"
                >
                    Cadastre-se
                </Link>
            </div>

            {showSavePasswordWarning && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65"
                    onClick={() => setShowSavePasswordWarning(false)}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="save-password-warning-title"
                        onClick={(e) => e.stopPropagation()}
                        className="flex w-full max-w-[400px] flex-col gap-[18px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-[26px]"
                    >
                        <div className="flex items-start gap-3">
                            <ShieldAlert
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0 text-[var(--destructive)]"
                            />
                            <div className="flex flex-col gap-1.5">
                                <span
                                    id="save-password-warning-title"
                                    className="text-[15px] font-bold text-[var(--foreground)]"
                                >
                                    Gravar senha neste dispositivo?
                                </span>
                                <p className="text-[13px] text-[var(--muted-foreground)]">
                                    Sua senha será salva sem criptografia no
                                    armazenamento local do navegador
                                    (localStorage). Qualquer pessoa com acesso
                                    a este computador ou navegador poderá lê-la.
                                    Use apenas em dispositivos pessoais e de
                                    confiança.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowSavePasswordWarning(false)}
                                className="h-11 flex-1 rounded-[9px] border-[var(--border)] bg-transparent text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--input-bg-nested)]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    setValue("gravarSenha", true);
                                    setShowSavePasswordWarning(false);
                                }}
                                className="h-11 flex-1 rounded-[9px] bg-[var(--primary)] text-sm font-bold text-white hover:bg-[var(--primary-hover)]"
                            >
                                Entendi, gravar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
