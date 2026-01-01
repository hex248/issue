import { type ChangeEvent, useMemo, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";

export function Field({
    label,
    value = "",
    onChange = () => {},
    validate,
    hidden = false,
    submitAttempted,
    placeholder,
}: {
    label: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    validate?: (value: string) => string | undefined;
    hidden?: boolean;
    submitAttempted?: boolean;
    placeholder?: string;
}) {
    const [internalTouched, setInternalTouched] = useState(false);
    const isTouched = submitAttempted || internalTouched;

    const invalidMessage = useMemo(() => {
        if (!isTouched) {
            return "";
        }
        return validate?.(value) ?? "";
    }, [isTouched, validate, value]);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-end justify-between w-full text-xs">
                <Label htmlFor={label} className="flex items-center text-sm">
                    {label}
                </Label>
            </div>
            <Input
                id={label}
                placeholder={placeholder ?? label}
                value={value}
                onChange={onChange}
                onBlur={() => setInternalTouched(true)}
                name={label}
                aria-invalid={invalidMessage !== ""}
                type={hidden ? "password" : "text"}
            />
            <div className="flex items-end justify-end w-full text-xs -mb-0 -mt-1">
                {invalidMessage !== "" ? (
                    <Label className="text-destructive text-sm">{invalidMessage}</Label>
                ) : (
                    <Label className="opacity-0 text-sm">a</Label>
                )}
            </div>
        </div>
    );
}
