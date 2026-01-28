import type { SubscriptionRecord } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";

interface GetSubscriptionParams {
  onSuccess?: (subscription: SubscriptionRecord | null) => void;
  onError?: (error: string) => void;
}

export async function getSubscription({ onSuccess, onError }: GetSubscriptionParams) {
  try {
    const response = await fetch(`${getServerURL()}/subscription/get`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      onError?.(data.error || "Failed to fetch subscription");
      return;
    }

    onSuccess?.(data.subscription);
  } catch (error) {
    onError?.("Network error");
  }
}
