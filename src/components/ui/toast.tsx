import { useToast } from "@/contexts/toastContext";

export function Toast() {
    const { toast } = useToast();

    if (!toast) return null;

    const isSuccess = toast.type === "success";

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed right-6 bottom-6 z-50 rounded-[10px] border px-[18px] py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            style={{
                background: isSuccess
                    ? "var(--toast-success-bg)"
                    : "var(--toast-error-bg)",
                borderColor: isSuccess
                    ? "var(--toast-success-border)"
                    : "var(--toast-error-border)",
                animation: "toast-in 0.2s ease-out",
            }}
        >
            {toast.message}
        </div>
    );
}
