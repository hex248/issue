import type { IssueResponse, OrganisationMemberResponse, ProjectResponse } from "@issue/shared";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "@/components/avatar";
import SmallUserDisplay from "@/components/small-user-display";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { issue, organisation } from "@/lib/server";
import { issueID } from "@/lib/utils";

export function IssueDetailPane({
    project,
    issueData,
    organisationId,
    close,
    onIssueUpdate,
}: {
    project: ProjectResponse;
    issueData: IssueResponse;
    organisationId: number;
    close: () => void;
    onIssueUpdate?: () => void;
}) {
    const [members, setMembers] = useState<OrganisationMemberResponse[]>([]);
    const [assigneeId, setAssigneeId] = useState<string>(
        issueData.Issue.assigneeId?.toString() ?? "unassigned",
    );

    useEffect(() => {
        setAssigneeId(issueData.Issue.assigneeId?.toString() ?? "unassigned");
    }, [issueData.Issue.assigneeId]);

    useEffect(() => {
        organisation.members({
            organisationId,
            onSuccess: (data) => {
                setMembers(data);
            },
            onError: (error) => {
                console.error("error fetching members:", error);
            },
        });
    }, [organisationId]);

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

            <div className="flex flex-col w-full p-2 py-1 gap-2">
                <h1 className="text-md">{issueData.Issue.title}</h1>
                <p className="text-sm">{issueData.Issue.description}</p>

                <div className="flex items-center gap-2">
                    <span className="text-sm">Assignee:</span>
                    <Select value={assigneeId} onValueChange={handleAssigneeChange}>
                        <SelectTrigger size="sm" className="w-fit">
                            <SelectValue placeholder="Select assignee">
                                {assigneeId === "unassigned"
                                    ? "Unassigned"
                                    : (() => {
                                          const member = members.find(
                                              (m) => m.User.id.toString() === assigneeId,
                                          );
                                          if (member) {
                                              return (
                                                  <>
                                                      <Avatar
                                                          name={member.User.name}
                                                          username={member.User.username}
                                                          avatarURL={member.User.avatarURL}
                                                          textClass="text-xs"
                                                      />
                                                      {member.User.name}
                                                  </>
                                              );
                                          }
                                          if (issueData.Assignee) {
                                              return (
                                                  <>
                                                      <Avatar
                                                          name={issueData.Assignee.name}
                                                          username={issueData.Assignee.username}
                                                          avatarURL={issueData.Assignee.avatarURL}
                                                          textClass="text-xs"
                                                      />
                                                      {issueData.Assignee.name}
                                                  </>
                                              );
                                          }
                                          return null;
                                      })()}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                            side="bottom"
                            position="popper"
                            className={"data-[side=bottom]:translate-y-1 data-[side=bottom]:translate-x-0.25"}
                        >
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {members.map((member) => (
                                <SelectItem key={member.User.id} value={member.User.id.toString()}>
                                    <Avatar
                                        name={member.User.name}
                                        username={member.User.username}
                                        avatarURL={member.User.avatarURL}
                                        textClass="text-xs"
                                    />
                                    {member.User.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-2 px-2 py-1 border-t text-sm text-muted-foreground">
                Created by:
                <SmallUserDisplay user={issueData.Creator} />
            </div>
        </div>
    );
}
