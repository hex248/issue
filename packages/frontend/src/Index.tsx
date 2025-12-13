import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { IssueRecord, ProjectRecord } from "@issue/shared";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

function IssueRow({ issue }: { issue: IssueRecord }) {
    return (
        <TableRow key={issue.id}>
            <TableCell className="font-medium">{issue.id}</TableCell>
            <TableCell>{issue.title}</TableCell>
            <TableCell>{issue.description}</TableCell>
        </TableRow>
    );
}

function Index() {
    const [projects, setProjects] = useState<ProjectRecord[]>([]);
    const projectsRef = useRef(false);

    useEffect(() => {
        if (projectsRef.current) return;
        projectsRef.current = true;

        fetch("http://localhost:3000/projects/all")
            .then((res) => res.json())
            .then((data: ProjectRecord[]) => {
                setProjects(data);
                console.log("fetched projects:", data);
            })
            .catch((err) => {
                console.error("error fetching projects:", err);
            });
    }, []);

    const [issues, setIssues] = useState<IssueRecord[]>([]);
    const issuesRef = useRef(false);

    const serverURL = import.meta.env.SERVER_URL?.trim() || "http://localhost:3000";

    useEffect(() => {
        if (issuesRef.current) return;
        issuesRef.current = true;

        fetch(`${serverURL}/issues/all`)
            .then((res) => res.json())
            .then((data: IssueRecord[]) => {
                setIssues(data);
                console.log("fetched issues:", data);
            })
            .catch((err) => {
                console.error("error fetching issues:", err);
            });
    }, []);

    return (
        <main className="w-full h-[100vh] flex flex-col items-start justify-start">
            <div id={"issues-table"} className="w-[80%] border">
                <Table>
                    <TableCaption>All Issues</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">a</TableHead>
                            <TableHead>a</TableHead>
                            <TableHead>a</TableHead>
                            <TableHead className="text-right">a</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {issues.map((issue) => (
                            <IssueRow key={issue.id} issue={issue} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}

export default Index;
