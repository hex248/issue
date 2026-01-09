import type { BunRequest } from "bun";
import { buildAuthCookie, generateToken, verifyPassword } from "../../auth/utils";
import { createSession, getUserByUsername } from "../../db/queries";

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

export default async function login(req: BunRequest) {
    if (req.method !== "POST") {
        return new Response("method not allowed", { status: 405 });
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return new Response("invalid JSON", { status: 400 });
    }

    if (!body || typeof body !== "object") {
        return new Response("invalid request body", { status: 400 });
    }

    const { username, password } = body as Record<string, unknown>;

    if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
        return new Response("username and password are required", { status: 400 });
    }

    const user = await getUserByUsername(username);
    if (!user) {
        return new Response("invalid credentials", { status: 401 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
        return new Response("invalid credentials", { status: 401 });
    }

    const session = await createSession(user.id);
    if (!session) {
        return new Response("failed to create session", { status: 500 });
    }

    const token = generateToken(session.id, user.id);

    return new Response(
        JSON.stringify({
            user: { id: user.id, name: user.name, username: user.username, avatarURL: user.avatarURL },
            csrfToken: session.csrfToken,
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": buildAuthCookie(token),
            },
        },
    );
}
