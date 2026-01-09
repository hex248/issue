import { UserRound } from "lucide-react";
import { useSession } from "@/components/session-provider";
import { cn } from "@/lib/utils";

const FALLBACK_COLOURS = [
    "bg-teal-500",
    "bg-rose-500",
    "bg-indigo-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-purple-500",
    "bg-lime-500",
    "bg-orange-500",
    "bg-sky-500",
    "bg-fuchsia-500",
    "bg-green-500",
    "bg-red-500",
    "bg-violet-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-pink-500",
];

function hashStringToIndex(value: string, modulo: number) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    return modulo === 0 ? 0 : hash % modulo;
}

function getInitials(username: string) {
    username = username.trim();

    const parts = username.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    if (parts.length === 0) return username.slice(0, 2).toUpperCase();

    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function Avatar({
    avatarURL: _avatarURL,
    name: _name,
    username,
    size,
    textClass = "text-xs",
    strong = false,
}: {
    avatarURL?: string | null;
    name?: string;
    username?: string;
    size?: number;
    textClass?: string;
    strong?: boolean;
}) {
    // if the username matches the authed user, use their avatarURL and name (avoid stale data)
    const { user } = useSession();
    const avatarURL = !strong && username && user && username === user.username ? user.avatarURL : _avatarURL;
    const name = !strong && username && user && username === user.username ? user.name : _name;

    const backgroundClass = username
        ? FALLBACK_COLOURS[hashStringToIndex(username, FALLBACK_COLOURS.length)]
        : "bg-muted";

    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full",
                "text-white font-medium select-none",
                name && "border",
                !avatarURL && backgroundClass,
                "transition-colors",
                `w-${size || 6}`,
                `h-${size || 6}`,
            )}
        >
            {avatarURL ? (
                <img
                    src={avatarURL}
                    alt="Avatar"
                    className={`rounded-full object-cover w-${size || 6} h-${size || 6}`}
                />
            ) : name ? (
                <span className={textClass}>{getInitials(name)}</span>
            ) : (
                <UserRound className={"size-10"} />
            )}
        </div>
    );
}
