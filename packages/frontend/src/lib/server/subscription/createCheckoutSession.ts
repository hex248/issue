import { getServerURL } from "@/lib/utils";

interface CreateCheckoutParams {
  billingPeriod: "monthly" | "annual";
  csrfToken: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export async function createCheckoutSession({
  billingPeriod,
  csrfToken,
  onSuccess,
  onError,
}: CreateCheckoutParams) {
  try {
    const response = await fetch(`${getServerURL()}/subscription/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ billingPeriod }),
    });

    const data = await response.json();

    if (!response.ok) {
      onError?.(data.error || "Failed to create checkout session");
      return;
    }

    onSuccess?.(data.url);
  } catch (error) {
    onError?.("Network error");
  }
}
