import { useEffect, useMemo, useState } from "react";
import { ProjectModal } from "@/components/project-modal";
import { useSelection } from "@/components/selection-provider";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/lib/query/hooks";

export function ProjectSelect({
    placeholder = "Select Project",
    showLabel = false,
    label = "Project",
    labelPosition = "top",
}: {
    placeholder?: string;
    showLabel?: boolean;
    label?: string;
    labelPosition?: "top" | "bottom";
}) {
    const [open, setOpen] = useState(false);
    const [pendingProjectId, setPendingProjectId] = useState<number | null>(null);
    const { selectedOrganisationId, selectedProjectId, selectProject } = useSelection();
    const { data: projectsData = [] } = useProjects(selectedOrganisationId);

    const projects = useMemo(
        () => [...projectsData].sort((a, b) => a.Project.name.localeCompare(b.Project.name)),
        [projectsData],
    );

    const selectedProject = useMemo(
        () => projects.find((proj) => proj.Project.id === selectedProjectId) ?? null,
        [projects, selectedProjectId],
    );

    useEffect(() => {
        if (!pendingProjectId) return;
        const project = projects.find((proj) => proj.Project.id === pendingProjectId);
        if (project) {
            selectProject(project);
            setPendingProjectId(null);
        }
    }, [pendingProjectId, projects, selectProject]);

    return (
        <Select
            value={selectedProject ? `${selectedProject.Project.id}` : undefined}
            onValueChange={(value) => {
                const project = projects.find((p) => p.Project.id === Number(value));
                if (!project) {
                    console.error(`NO PROJECT FOUND FOR ID: ${value}`);
                    return;
                }
                selectProject(project);
            }}
            onOpenChange={setOpen}
        >
            <SelectTrigger
                className="text-sm"
                isOpen={open}
                label={showLabel ? label : undefined}
                hasValue={!!selectedProject}
                labelPosition={labelPosition}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent side="bottom" position="popper" align={"start"}>
                <SelectGroup>
                    <SelectLabel>Projects</SelectLabel>
                    {projects.map((project) => (
                        <SelectItem key={project.Project.id} value={`${project.Project.id}`}>
                            {project.Project.name}
                        </SelectItem>
                    ))}
                    {projects.length > 0 && <SelectSeparator />}
                </SelectGroup>
                <ProjectModal
                    organisationId={selectedOrganisationId ?? undefined}
                    trigger={
                        <Button
                            size={"sm"}
                            variant="ghost"
                            className={"w-full"}
                            disabled={!selectedOrganisationId}
                        >
                            Create Project
                        </Button>
                    }
                    completeAction={async (project) => {
                        try {
                            setPendingProjectId(project.id);
                        } catch (err) {
                            console.error(err);
                        }
                    }}
                />
            </SelectContent>
        </Select>
    );
}
