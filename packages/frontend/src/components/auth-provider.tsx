import type { UserRecord } from "@issue/shared";
import { useEffect, useRef, useState } from "react";
import LogInForm from "./login-form";

type AuthProviderProps = {
    children: React.ReactNode;
    loggedInDefault?: boolean;
};

export function Auth({ children }: AuthProviderProps) {
    const serverURL = import.meta.env.SERVER_URL?.trim() || "http://localhost:3000";

    const [loggedIn, setLoggedIn] = useState<boolean>();
    const fetched = useRef(false);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        const token = localStorage.getItem("token");
        if (!token) {
            return setLoggedIn(false);
        }
        fetch(`${serverURL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data: UserRecord) => {
                if (data) {
                    setLoggedIn(true);
                    localStorage.setItem("user", JSON.stringify(data));
                }
            })
            .catch((err) => {
                setLoggedIn(false);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                console.error("user not logged in:", err);
            });
    }, []);

    if (loggedIn) {
        return <>{children}</>;
    }
    if (loggedIn === false)
        return (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-[100vh]">
                <LogInForm />
            </div>
        );

    return <>loading...</>;
}
