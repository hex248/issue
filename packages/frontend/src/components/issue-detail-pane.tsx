import type { IssueResponse, ProjectResponse, UserRecord } from "@issue/shared";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import SmallUserDisplay from "@/components/small-user-display";
import { StatusSelect } from "@/components/status-select";
import StatusTag from "@/components/status-tag";
import { TimerModal } from "@/components/timer-modal";
import { Button } from "@/components/ui/button";
import { SelectTrigger } from "@/components/ui/select";
import { UserSelect } from "@/components/user-select";
import { issue } from "@/lib/server";
import { issueID } from "@/lib/utils";

export function IssueDetailPane({
    project,
    issueData,
    members,
    statuses,
    close,
    onIssueUpdate,
}: {
    project: ProjectResponse;
    issueData: IssueResponse;
    members: UserRecord[];
    statuses: Record<string, string>;
    close: () => void;
    onIssueUpdate?: () => void;
}) {
    const { user } = useSession();
    const [assigneeId, setAssigneeId] = useState<string>(
        issueData.Issue.assigneeId?.toString() ?? "unassigned",
    );
    const [status, setStatus] = useState<string>(issueData.Issue.status);

    useEffect(() => {
        setAssigneeId(issueData.Issue.assigneeId?.toString() ?? "unassigned");
        setStatus(issueData.Issue.status);
    }, [issueData.Issue.assigneeId, issueData.Issue.status]);

    const handleAssigneeChange = async (value: string) => {
        setAssigneeId(value);
        const newAssigneeId = value === "unassigned" ? null : Number(value);

        await issue.update({
            issueId: issueData.Issue.id,
            assigneeId: newAssigneeId,
            onSuccess: () => {
                onIssueUpdate?.();
            },
            onError: (error) => {
                console.error("error updating assignee:", error);
                setAssigneeId(issueData.Issue.assigneeId?.toString() ?? "unassigned");
            },
        });
    };

    const handleStatusChange = async (value: string) => {
        setStatus(value);

        await issue.update({
            issueId: issueData.Issue.id,
            status: value,
            onSuccess: () => {
                onIssueUpdate?.();
            },
            onError: (error) => {
                console.error("error updating status:", error);
                setStatus(issueData.Issue.status);
            },
        });
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center justify-end border-b h-[25px]">
                <span className="w-full">
                    <p className="text-sm w-fit px-1">
                        {issueID(project.Project.key, issueData.Issue.number)}
                    </p>
                </span>

                <Button variant={"dummy"} onClick={close} className="px-0 py-0 w-6 h-6">
                    <X />
                </Button>
            </div>

            <div className="flex flex-col w-full p-2 py-2 gap-2">
                <div className="flex gap-2">
                    <StatusSelect
                        statuses={statuses}
                        value={status}
                        onChange={handleStatusChange}
                        trigger={({ isOpen, value }) => (
                            <SelectTrigger
                                className="group w-auto flex items-center"
                                variant="unstyled"
                                chevronClassName="hidden"
                                isOpen={isOpen}
                            >
                                <StatusTag
                                    status={value}
                                    colour={statuses[value]}
                                    className="hover:opacity-85"
                                />
                            </SelectTrigger>
                        )}
                    />
                    <div className="flex w-full items-center min-w-0">
                        <span className="block w-full truncate">{issueData.Issue.title}</span>
                    </div>
                </div>
                {issueData.Issue.description !== "" && (
                    <p className="text-sm">{issueData.Issue.description}</p>
                )}

                <div className="flex items-center gap-2">
                    <span className="text-sm">Assignee:</span>
                    <UserSelect
                        users={members}
                        value={assigneeId}
                        onChange={handleAssigneeChange}
                        fallbackUser={issueData.Assignee}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Created by:</span>
                    <SmallUserDisplay user={issueData.Creator} className={"text-sm"} />
                </div>

                {user?.id === Number(assigneeId) && (
                    <div>
                        <TimerModal issueId={issueData.Issue.id} />
                    </div>
                )}
            </div>
        </div>
    );
}
