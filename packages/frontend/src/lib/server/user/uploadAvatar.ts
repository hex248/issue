import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function uploadAvatar(file: File): Promise<string> {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Allowed types: png, jpg, jpeg, webp, gif");
  }

  const formData = new FormData();
  formData.append("file", file);

  const csrfToken = getCsrfToken();
  const headers: HeadersInit = {};
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

  const res = await fetch(`${getServerURL()}/user/upload-avatar`, {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `Failed to upload avatar (${res.status})`);
    throw new Error(message);
  }

  const data = await res.json();
  if (data.avatarURL) {
    return data.avatarURL;
  }

  throw new Error("Failed to upload avatar");
}
