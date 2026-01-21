import type { TimerState, TimerToggleRequest } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function toggle(request: TimerToggleRequest): Promise<TimerState> {
  const csrfToken = getCsrfToken();

  const res = await fetch(`${getServerURL()}/timer/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(request),
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to toggle timer (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
