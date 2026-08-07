import { LeftSection } from "@/components/sections/left-section";
import { LoginRightSection } from "@/components/sections/login-right-section";

export function LoginPage() {
  return (
    <div className="theme-garden flex min-h-screen w-full flex-col lg:flex-row">
        <LeftSection />
        <LoginRightSection />
    </div>
  );
}