import { RegisterRequestSchema } from "@sprint/shared";
import type { BunRequest } from "bun";
import { buildAuthCookie, generateToken, hashPassword } from "../../auth/utils";
import { createSession, createUser, getUserByUsername } from "../../db/queries";
import { getUserByEmail } from "../../db/queries/users";
import { errorResponse, parseJsonBody } from "../../validation";

export default async function register(req: BunRequest) {
    if (req.method !== "POST") {
        return errorResponse("method not allowed", "METHOD_NOT_ALLOWED", 405);
    }

    const parsed = await parseJsonBody(req, RegisterRequestSchema);
    if ("error" in parsed) return parsed.error;

    const { name, username, email, password, avatarURL } = parsed.data;

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
        return errorResponse("username already taken", "USERNAME_TAKEN", 400);
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
        return errorResponse("email already registered", "EMAIL_TAKEN", 400);
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(name, username, email, passwordHash, avatarURL);
    if (!user) {
        return errorResponse("failed to create user", "USER_CREATE_ERROR", 500);
    }

    const session = await createSession(user.id);
    if (!session) {
        return errorResponse("failed to create session", "SESSION_ERROR", 500);
    }

    const token = generateToken(session.id, user.id);

    return new Response(
        JSON.stringify({
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                avatarURL: user.avatarURL,
                iconPreference: user.iconPreference,
            },
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
