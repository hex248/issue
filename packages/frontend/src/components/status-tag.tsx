import { cn } from "@/lib/utils";

export default function StatusTag({ status, className }: { status: string; className?: string }) {
    return (
        <div
            className={cn(
                "text-xs px-1 bg-foreground/85 rounded text-background inline-flex whitespace-nowrap",
                className,
            )}
        >
            {status}
        </div>
    );
}
