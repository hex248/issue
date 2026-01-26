import type { TimerListItem } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

type TimerListInput = {
  limit?: number;
  offset?: number;
  activeOnly?: boolean;
};

export async function list(input: TimerListInput = {}): Promise<TimerListItem[]> {
  const url = new URL(`${getServerURL()}/timers`);
  if (input.limit != null) url.searchParams.set("limit", `${input.limit}`);
  if (input.offset != null) url.searchParams.set("offset", `${input.offset}`);
  if (input.activeOnly != null) url.searchParams.set("activeOnly", input.activeOnly ? "true" : "false");

  const csrfToken = getCsrfToken();
  const headers: HeadersInit = {};
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

  const res = await fetch(url.toString(), {
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to get timers (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
