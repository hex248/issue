import { getServerURL } from "@/lib/utils";

interface CreatePortalParams {
  csrfToken: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export async function createPortalSession({ csrfToken, onSuccess, onError }: CreatePortalParams) {
  try {
    const response = await fetch(`${getServerURL()}/subscription/create-portal-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      onError?.(data.error || "Failed to create portal session");
      return;
    }

    onSuccess?.(data.url);
  } catch (error) {
    onError?.("Network error");
  }
}
