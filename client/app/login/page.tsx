import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function LoginFormFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center justify-center">
          <Logo size="md" showSubtitle={true} showText={true} />
        </Link>
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
