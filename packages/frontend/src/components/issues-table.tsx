import type { IssueResponse } from "@sprint/shared";
import Avatar from "@/components/avatar";
import StatusTag from "@/components/status-tag";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function IssuesTable({
    issuesData,
    columns = {},
    issueSelectAction,
    statuses,
    className,
}: {
    issuesData: IssueResponse[];
    columns?: { id?: boolean; title?: boolean; description?: boolean; status?: boolean; assignee?: boolean };
    issueSelectAction?: (issue: IssueResponse) => void;
    statuses: Record<string, string>;
    className: string;
}) {
    return (
        <Table className={cn("table-fixed", className)}>
            <TableHeader>
                <TableRow hoverEffect={false}>
                    {(columns.id == null || columns.id === true) && (
                        <TableHead className="text-right w-10 border-r">ID</TableHead>
                    )}
                    {(columns.title == null || columns.title === true) && <TableHead>Title</TableHead>}
                    {(columns.description == null || columns.description === true) && (
                        <TableHead>Description</TableHead>
                    )}
                    {/* below is kept blank to fill the space, used as the "Assignee" column */}
                    {(columns.assignee == null || columns.assignee === true) && (
                        <TableHead className="w-[1%]"></TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {issuesData.map((issueData) => (
                    <TableRow
                        key={issueData.Issue.id}
                        className="cursor-pointer max-w-full"
                        onClick={() => {
                            issueSelectAction?.(issueData);
                        }}
                    >
                        {(columns.id == null || columns.id === true) && (
                            <TableCell className="font-medium border-r text-right">
                                {issueData.Issue.number.toString().padStart(3, "0")}
                            </TableCell>
                        )}
                        {(columns.title == null || columns.title === true) && (
                            <TableCell className="min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    {(columns.status == null || columns.status === true) && (
                                        <StatusTag
                                            status={issueData.Issue.status}
                                            colour={statuses[issueData.Issue.status]}
                                        />
                                    )}
                                    <span className="truncate">{issueData.Issue.title}</span>
                                </div>
                            </TableCell>
                        )}
                        {(columns.description == null || columns.description === true) && (
                            <TableCell className="overflow-hidden">{issueData.Issue.description}</TableCell>
                        )}
                        {(columns.assignee == null || columns.assignee === true) && (
                            <TableCell className={"flex items-center justify-end py-0 h-[32px]"}>
                                {issueData.Assignees && issueData.Assignees.length > 0 && (
                                    <div className="flex items-center -space-x-2 pr-1.5">
                                        {issueData.Assignees.slice(0, 3).map((assignee) => (
                                            <Avatar
                                                key={assignee.id}
                                                name={assignee.name}
                                                username={assignee.username}
                                                avatarURL={assignee.avatarURL}
                                                textClass="text-xs"
                                                className="ring-1 ring-background"
                                            />
                                        ))}
                                        {issueData.Assignees.length > 3 && (
                                            <span className="flex items-center justify-center w-6 h-6 text-[10px] font-medium bg-muted text-muted-foreground rounded-full ring-1 ring-background">
                                                +{issueData.Assignees.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
