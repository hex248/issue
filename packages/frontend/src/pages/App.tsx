/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */

import { useEffect, useMemo, useRef } from "react";
import AccountDialog from "@/components/account-dialog";
import { IssueDetailPane } from "@/components/issue-detail-pane";
import { IssueModal } from "@/components/issue-modal";
import { IssuesTable } from "@/components/issues-table";
import LogOutButton from "@/components/log-out-button";
import { OrganisationSelect } from "@/components/organisation-select";
import OrganisationsDialog from "@/components/organisations-dialog";
import { ProjectSelect } from "@/components/project-select";
import { useSelection } from "@/components/selection-provider";
import { ServerConfigurationDialog } from "@/components/server-configuration-dialog";
import { useAuthenticatedSession } from "@/components/session-provider";
import SmallUserDisplay from "@/components/small-user-display";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResizablePanel, ResizablePanelGroup, ResizableSeparator } from "@/components/ui/resizable";
import { useIssues, useOrganisations, useProjects, useSelectedIssue } from "@/lib/query/hooks";

const BREATHING_ROOM = 1;

export default function App() {
    const { user } = useAuthenticatedSession();
    const {
        selectedOrganisationId,
        selectedProjectId,
        selectedIssueId,
        initialParams,
        selectOrganisation,
        selectProject,
        selectIssue,
    } = useSelection();

    const { data: organisationsData = [] } = useOrganisations();
    const { data: projectsData = [] } = useProjects(selectedOrganisationId);
    const { data: issuesData = [] } = useIssues(selectedProjectId);
    const selectedIssue = useSelectedIssue();

    const organisations = useMemo(
        () => [...organisationsData].sort((a, b) => a.Organisation.name.localeCompare(b.Organisation.name)),
        [organisationsData],
    );
    const projects = useMemo(
        () => [...projectsData].sort((a, b) => a.Project.name.localeCompare(b.Project.name)),
        [projectsData],
    );

    const deepLinkStateRef = useRef({
        appliedOrg: false,
        appliedProject: false,
        appliedIssue: false,
        orgMatched: false,
        projectMatched: false,
    });

    useEffect(() => {
        if (organisations.length === 0) return;

        let selected = organisations.find((org) => org.Organisation.id === selectedOrganisationId) ?? null;
        const deepLinkState = deepLinkStateRef.current;

        if (!selected && initialParams.orgSlug && !deepLinkState.appliedOrg) {
            const match = organisations.find(
                (org) => org.Organisation.slug.toLowerCase() === initialParams.orgSlug,
            );
            deepLinkState.appliedOrg = true;
            deepLinkState.orgMatched = Boolean(match);
            if (match) {
                selected = match;
            }
        }

        if (!selected) {
            selected = organisations[0] ?? null;
        }

        if (selected && selected.Organisation.id !== selectedOrganisationId) {
            selectOrganisation(selected);
        }
    }, [organisations, selectedOrganisationId, initialParams.orgSlug]);

    useEffect(() => {
        if (projects.length === 0) return;

        let selected = projects.find((project) => project.Project.id === selectedProjectId) ?? null;
        const deepLinkState = deepLinkStateRef.current;

        if (
            !selected &&
            initialParams.projectKey &&
            deepLinkState.orgMatched &&
            !deepLinkState.appliedProject
        ) {
            const match = projects.find(
                (project) => project.Project.key.toLowerCase() === initialParams.projectKey,
            );
            deepLinkState.appliedProject = true;
            deepLinkState.projectMatched = Boolean(match);
            if (match) {
                selected = match;
            }
        }

        if (!selected) {
            selected = projects[0] ?? null;
        }

        if (selected && selected.Project.id !== selectedProjectId) {
            selectProject(selected);
        }
    }, [projects, selectedProjectId, initialParams.projectKey]);

    useEffect(() => {
        if (issuesData.length === 0) return;

        const deepLinkState = deepLinkStateRef.current;
        if (
            initialParams.issueNumber != null &&
            deepLinkState.projectMatched &&
            !deepLinkState.appliedIssue
        ) {
            const match = issuesData.find((issue) => issue.Issue.number === initialParams.issueNumber);
            deepLinkState.appliedIssue = true;
            if (match && match.Issue.id !== selectedIssueId) {
                selectIssue(match);
            }
        }
    }, [issuesData, selectedIssueId, initialParams.issueNumber]);

    return (
        <main className={`w-full h-screen flex flex-col gap-${BREATHING_ROOM} p-${BREATHING_ROOM}`}>
            <div className="flex gap-12 items-center justify-between">
                <div className={`flex gap-${BREATHING_ROOM} items-center`}>
                    <OrganisationSelect showLabel />

                    {selectedOrganisationId && <ProjectSelect showLabel />}
                    {selectedOrganisationId && selectedProjectId && <IssueModal />}
                </div>
                <div className={`flex gap-${BREATHING_ROOM} items-center`}>
                    <ThemeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-sm">
                            <SmallUserDisplay user={user} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={"end"}>
                            <DropdownMenuItem asChild className="flex items-end justify-end">
                                <AccountDialog />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="flex items-end justify-end">
                                <OrganisationsDialog />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="flex items-end justify-end">
                                <ServerConfigurationDialog
                                    trigger={
                                        <Button
                                            variant="ghost"
                                            className="flex w-full items-center justify-end text-end px-2 py-1 m-0 h-auto"
                                            title="Server Configuration"
                                        >
                                            Server Configuration
                                        </Button>
                                    }
                                />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-end justify-end p-0 m-0">
                                <LogOutButton noStyle className={"flex w-full justify-end"} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {selectedOrganisationId && selectedProjectId && issuesData.length > 0 && (
                <ResizablePanelGroup className={`flex-1`}>
                    <ResizablePanel id={"left"} minSize={400}>
                        <IssuesTable columns={{ description: false }} className="border w-full flex-shrink" />
                    </ResizablePanel>

                    {selectedIssue && (
                        <>
                            <ResizableSeparator />
                            <ResizablePanel id={"right"} defaultSize={"30%"} minSize={363} maxSize={"60%"}>
                                <div className="border">
                                    <IssueDetailPane />
                                </div>
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            )}
        </main>
    );
}
