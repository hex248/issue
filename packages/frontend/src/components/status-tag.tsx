import { cn } from "@/lib/utils";

const DARK_TEXT_COLOUR = "#0a0a0a";
const THRESHOLD = 0.6;

const isLight = (hex: string): boolean => {
    const num = Number.parseInt(hex.replace("#", ""), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > THRESHOLD;
};

export default function StatusTag({
    status,
    colour,
    className,
}: {
    status: string;
    colour: string;
    className?: string;
}) {
    const textColour = isLight(colour) ? DARK_TEXT_COLOUR : "var(--foreground)";

    return (
        <div
            className={cn(
                "text-xs px-1 rounded inline-flex whitespace-nowrap border border-foreground/10",
                className,
            )}
            style={{ backgroundColor: colour, color: textColour }}
        >
            {status}
        </div>
    );
}
