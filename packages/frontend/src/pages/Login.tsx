import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "@/components/loading";
import LogInForm from "@/components/login-form";
import { useSession } from "@/components/session-provider";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && user) {
      const next = searchParams.get("next") || "/issues";
      navigate(next, { replace: true });
    }
  }, [user, isLoading, navigate, searchParams]);

  if (isLoading) {
    return <Loading message="Checking authentication" />;
  }

  if (user) {
    return <Loading message="Redirecting" />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-[100vh]">
      <LogInForm />
    </div>
  );
}
