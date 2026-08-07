import { LeftSection } from "@/components/sections/left-section";
import { LoginRightSection } from "@/components/sections/login-right-section";

export function LoginPage() {
  return (
    <div className="flex min-h-screen">
        <LeftSection />
        <LoginRightSection />
    </div>
  );
}