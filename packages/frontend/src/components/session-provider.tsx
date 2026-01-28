import type { UserResponse } from "@sprint/shared";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import Loading from "@/components/loading";
import { LoginModal } from "@/components/login-modal";
import { clearAuth, getServerURL, setCsrfToken } from "@/lib/utils";

interface SessionContextValue {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

// for use outside RequireAuth
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

// safe version that returns null if outside provider
export function useSessionSafe(): SessionContextValue | null {
  return useContext(SessionContext);
}

// for use inside RequireAuth
export function useAuthenticatedSession(): { user: UserResponse; setUser: (user: UserResponse) => void } {
  const { user, setUser } = useSession();
  if (!user) {
    throw new Error("useAuthenticatedSession must be used within RequireAuth");
  }
  return { user, setUser };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetched = useRef(false);

  const setUser = useCallback((user: UserResponse) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch(`${getServerURL()}/auth/me`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`auth check failed: ${res.status}`);
        }
        const data = (await res.json()) as { user: UserResponse; csrfToken: string };
        setUser(data.user);
        setCsrfToken(data.csrfToken);
      })
      .catch(() => {
        setUserState(null);
        clearAuth();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setUser]);

  return <SessionContext.Provider value={{ user, setUser, isLoading }}>{children}</SessionContext.Provider>;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setLoginModalOpen(true);
    } else if (user) {
      setLoginModalOpen(false);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <Loading message={"Checking authentication"} />;
  }

  if (!user) {
    return <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} dismissible={false} />;
  }

  return <>{children}</>;
}
