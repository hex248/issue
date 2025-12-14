import type { IssueRecord, ProjectRecord } from "@issue/shared";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { issueID } from "@/lib/utils";

export function IssueDetailPane({
    project,
    issue,
    close,
}: {
    project: ProjectRecord;
    issue: IssueRecord;
    close: () => void;
}) {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center justify-end border-b">
                <span className="w-full px-0.5">
                    <p className="text-sm w-fit px-0.75">{issueID(project.blob, issue.number)}</p>
                </span>

                <Button variant={"dummy"} onClick={close} className="px-0 py-0 w-6 h-6">
                    <X />
                </Button>
            </div>

            <div className="flex flex-col w-full p-2 gap-2">
                <h1 className="text-md">{issue.title}</h1>
                <p className="text-sm">{issue.description}</p>
            </div>
        </div>
    );
}
