import type { IssueByIdQuery, IssueResponse } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function byId(issueId: IssueByIdQuery["issueId"]): Promise<IssueResponse> {
  const url = new URL(`${getServerURL()}/issue/by-id`);
  url.searchParams.set("issueId", `${issueId}`);

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to get issue (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
