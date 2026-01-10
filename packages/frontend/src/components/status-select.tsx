import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StatusSelect({
    statuses,
    value,
    onChange,
    placeholder = "Select status",
}: {
    statuses: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Select value={value} onValueChange={onChange} onOpenChange={setIsOpen}>
            <SelectTrigger
                className="w-fit px-2 text-xs gap-1"
                size="sm"
                chevronClassName={"size-3 -mr-1"}
                isOpen={isOpen}
            >
                <SelectValue placeholder={placeholder}>{value}</SelectValue>
            </SelectTrigger>
            <SelectContent
                side="bottom"
                position="popper"
                align="start"
            >
                {statuses.map((status) => (
                    <SelectItem key={status} value={status} textClassName="text-xs">
                        {status}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
