import { useMemo } from "react";
import Account from "@/components/account";
import { IssueForm } from "@/components/issue-form";
import LogOutButton from "@/components/log-out-button";
import OrgIcon from "@/components/org-icon";
import { OrganisationSelect } from "@/components/organisation-select";
import Organisations from "@/components/organisations";
import { ProjectSelect } from "@/components/project-select";
import { useSelection } from "@/components/selection-provider";
import { ServerConfiguration } from "@/components/server-configuration";
import { useAuthenticatedSession } from "@/components/session-provider";
import SmallUserDisplay from "@/components/small-user-display";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { BREATHING_ROOM } from "@/lib/layout";
import { useOrganisations } from "@/lib/query/hooks";

export default function TopBar({ showIssueForm = true }: { showIssueForm?: boolean }) {
  const { user } = useAuthenticatedSession();
  const { selectedOrganisationId, selectedProjectId } = useSelection();
  const { data: organisationsData = [] } = useOrganisations();

  const selectedOrganisation = useMemo(
    () => organisationsData.find((org) => org.Organisation.id === selectedOrganisationId) ?? null,
    [organisationsData, selectedOrganisationId],
  );

  return (
    <div className="flex gap-12 items-center justify-between">
      <div className={`flex gap-${BREATHING_ROOM} items-center`}>
        <OrganisationSelect
          noDecoration
          triggerClassName="px-1 rounded-full hover:bg-transparent dark:hover:bg-transparent"
          trigger={
            <OrgIcon
              name={selectedOrganisation?.Organisation.name ?? ""}
              slug={selectedOrganisation?.Organisation.slug ?? ""}
              iconURL={selectedOrganisation?.Organisation.iconURL || undefined}
              size={7}
            />
          }
        />

        {selectedOrganisationId && <ProjectSelect showLabel />}
        {selectedOrganisationId && selectedProjectId && showIssueForm && (
          <IssueForm
            trigger={
              <IconButton
                variant="outline"
                className="w-9 h-9"
                title="Create Issue"
                aria-label="Create issue"
              >
                <Icon icon="plus" />
              </IconButton>
            }
          />
        )}
      </div>
      <div className={`flex gap-${BREATHING_ROOM} items-center`}>
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm">
            <SmallUserDisplay user={user} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild className="flex items-end justify-end">
              <Account />
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="flex items-end justify-end">
              <Organisations />
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="flex items-end justify-end">
              <ServerConfiguration
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
              <LogOutButton noStyle className="flex w-full justify-end" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
