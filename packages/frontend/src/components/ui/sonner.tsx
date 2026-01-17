import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import Icon from "@/components/ui/icon";

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            icons={{
                success: <Icon icon="circleCheckIcon" className="size-4" />,
                info: <Icon icon="infoIcon" className="size-4" />,
                warning: <Icon icon="triangleAlertIcon" className="size-4" />,
                error: <Icon icon="octagonXIcon" className="size-4" />,
                loading: <Icon icon="loader2Icon" className="size-4 animate-spin" />,
            }}
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                    "--border-radius": "0",
                } as React.CSSProperties
            }
            {...props}
        />
    );
};

export { Toaster };
