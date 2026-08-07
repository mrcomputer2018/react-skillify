export function LoginRightSection() {
    return (
        <section className={`flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:min-h-screen bg-[#F7F9FB] dark:bg-background`}>
            <div className="w-full max-w-xl space-y-8 rounded-[2rem] border border-gray-300 bg-white p-6 shadow-[0_24px_80px_-48px_rgba(7,18,38,0.6)] sm:p-10 dark:border-border dark:bg-card">
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold tracking-tight">
                        {title}
                    </h2>
                    <p className="max-w-md text-sm leading-6 text-muted-foreground">
                        {description}
                    </p>
                </div>

                <LoginForm/>
            </div>
        </section>
    );
}
