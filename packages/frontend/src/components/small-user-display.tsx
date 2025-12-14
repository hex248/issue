import type { UserRecord } from "@issue/shared";
import { UserRound } from "lucide-react";

export default function SmallUserDisplay({ user }: { user: UserRecord }) {
    return (
        <div className="flex gap-2 items-center">
            {user.name}{" "}
            <div className="flex items-center justify-center rounded-full border w-7 h-7">
                <UserRound size={15} />
            </div>
        </div>
    );
}
