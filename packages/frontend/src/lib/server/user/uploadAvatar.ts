import { getAuthHeaders, getServerURL, resizeImageToSquare } from "@/lib/utils";
import type { ServerQueryInput } from "..";

export async function uploadAvatar({
    file,
    onSuccess,
    onError,
}: {
    file: File;
} & ServerQueryInput) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

    if (file.size > MAX_FILE_SIZE) {
        onError?.("File size exceeds 5MB limit");
        return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        onError?.("Invalid file type. Allowed types: png, jpg, jpeg, webp, gif");
        return;
    }

    let resizedFile: File;
    try {
        const blob = await resizeImageToSquare(file, 256);
        resizedFile = new File([blob], "avatar.png", { type: "image/png" });
    } catch (_error) {
        onError?.("Failed to resize image");
        return;
    }

    const formData = new FormData();
    formData.append("file", resizedFile);

    const res = await fetch(`${getServerURL()}/user/upload-avatar`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });

    if (!res.ok) {
        const error = await res.text();
        onError?.(error || `Failed to upload avatar (${res.status})`);
        return;
    }

    const data = await res.json();
    if (data.avatarURL) {
        onSuccess?.(data.avatarURL, res);
    } else {
        onError?.("Failed to upload avatar");
    }
}
