import type { AuthedRequest } from "../../auth/middleware";
import { getUserById } from "../../db/queries";

export default async function me(req: AuthedRequest) {
    const user = await getUserById(req.userId);
    if (!user) {
        return new Response("user not found", { status: 404 });
    }

    return Response.json({ id: user.id, name: user.name, username: user.username });
}
