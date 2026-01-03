import type { OrganisationMemberResponse, OrganisationResponse, UserRecord } from "@issue/shared";
import { Plus, X } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { OrganisationSelect } from "@/components/organisation-select";
import SmallUserDisplay from "@/components/small-user-display";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { organisation } from "@/lib/server";

function OrganisationsDialog({
    trigger,
    organisations,
    selectedOrganisation,
    setSelectedOrganisation,
    refetchOrganisations,
}: {
    trigger?: ReactNode;
    organisations: OrganisationResponse[];
    selectedOrganisation: OrganisationResponse | null;
    setSelectedOrganisation: (organisation: OrganisationResponse | null) => void;
    refetchOrganisations: (options?: { selectOrganisationId?: number }) => Promise<void>;
}) {
    const user = JSON.parse(localStorage.getItem("user") || "{}") as UserRecord;

    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState<OrganisationMemberResponse[]>([]);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        memberUserId: number;
        memberName: string;
    }>({ open: false, memberUserId: 0, memberName: "" });

    const refetchMembers = useCallback(async () => {
        if (!selectedOrganisation) return;
        try {
            await organisation.members({
                organisationId: selectedOrganisation.Organisation.id,
                onSuccess: (data) => {
                    const members = data as OrganisationMemberResponse[];
                    members.sort((a, b) => {
                        const nameCompare = a.User.name.localeCompare(b.User.name);
                        return nameCompare !== 0
                            ? nameCompare
                            : b.OrganisationMember.role.localeCompare(a.OrganisationMember.role);
                    });
                    setMembers(members);
                },
                onError: (error) => {
                    console.error(error);
                    setMembers([]);
                },
            });
        } catch (err) {
            console.error("error fetching members:", err);
            setMembers([]);
        }
    }, [selectedOrganisation]);

    const handleRemoveMember = async (memberUserId: number, memberName: string) => {
        setConfirmDialog({ open: true, memberUserId, memberName });
    };

    const confirmRemoveMember = async () => {
        if (!selectedOrganisation) return;

        try {
            await organisation.removeMember({
                organisationId: selectedOrganisation.Organisation.id,
                userId: confirmDialog.memberUserId,
                onSuccess: () => {
                    setConfirmDialog({ open: false, memberUserId: 0, memberName: "" });
                    void refetchMembers();
                },
                onError: (error) => {
                    console.error(error);
                },
            });
        } catch (err) {
            console.error(err);
        }
    };

    // useEffect(() => {
    //     if (!open) return;
    //     void refetchOrganisations();
    // }, [open, refetchOrganisations]);

    useEffect(() => {
        if (!open) return;
        void refetchMembers();
    }, [open, refetchMembers]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" className="flex w-full justify-end px-2 py-1 m-0 h-auto">
                        My Organisations
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md w-full max-w-[calc(100vw-2rem)]">
                <DialogHeader>
                    <DialogTitle>Organisations</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                        <OrganisationSelect
                            organisations={organisations}
                            selectedOrganisation={selectedOrganisation}
                            onSelectedOrganisationChange={(org) => {
                                setSelectedOrganisation(org);
                                localStorage.setItem("selectedOrganisationId", `${org?.Organisation.id}`);
                            }}
                            onCreateOrganisation={async (organisationId) => {
                                await refetchOrganisations({ selectOrganisationId: organisationId });
                            }}
                            contentClass={
                                "data-[side=bottom]:translate-y-2 data-[side=bottom]:translate-x-0.25"
                            }
                        />
                    </div>

                    {selectedOrganisation ? (
                        <div className="flex flex-col gap-2 min-w-0">
                            <div className="w-full border p-2 min-w-0 overflow-hidden">
                                <h2 className="text-xl font-600 mb-2 break-all">
                                    {selectedOrganisation.Organisation.name}
                                </h2>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-muted-foreground break-all">
                                        Slug: {selectedOrganisation.Organisation.slug}
                                    </p>
                                    <p className="text-sm text-muted-foreground break-all">
                                        Role: {selectedOrganisation.OrganisationMember.role}
                                    </p>
                                    {selectedOrganisation.Organisation.description ? (
                                        <p className="text-sm break-words">
                                            {selectedOrganisation.Organisation.description}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground break-words">
                                            No description
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="border p-2 min-w-0 overflow-hidden">
                                <h2 className="text-xl font-600 mb-2">
                                    {members.length} Member{members.length !== 1 ? "s" : ""}
                                </h2>
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex flex-col gap-2 max-h-56 overflow-y-scroll">
                                        {members.map((member) => (
                                            <div
                                                key={member.OrganisationMember.id}
                                                className="flex items-center justify-between p-2 border"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <SmallUserDisplay user={member.User} />
                                                    <span className="text-sm text-muted-foreground">
                                                        {member.OrganisationMember.role}
                                                    </span>
                                                </div>
                                                {(selectedOrganisation.OrganisationMember.role === "owner" ||
                                                    selectedOrganisation.OrganisationMember.role ===
                                                        "admin") &&
                                                    member.OrganisationMember.role !== "owner" &&
                                                    member.User.id !== user.id && (
                                                        <Button
                                                            variant="dummy"
                                                            size="none"
                                                            onClick={() =>
                                                                handleRemoveMember(
                                                                    member.User.id,
                                                                    member.User.name,
                                                                )
                                                            }
                                                        >
                                                            <X className="size-5 text-destructive" />
                                                        </Button>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                    {(selectedOrganisation.OrganisationMember.role === "owner" ||
                                        selectedOrganisation.OrganisationMember.role === "admin") && (
                                        <AddMemberDialog
                                            organisationId={selectedOrganisation.Organisation.id}
                                            existingMembers={members.map((m) => m.User.username)}
                                            onSuccess={refetchMembers}
                                            trigger={
                                                <Button variant="outline">
                                                    Add user <Plus className="size-4" />
                                                </Button>
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No organisations yet.</p>
                    )}

                    <ConfirmDialog
                        open={confirmDialog.open}
                        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
                        onConfirm={confirmRemoveMember}
                        title="Remove Member"
                        processingText="Removing..."
                        message={`Are you sure you want to remove ${confirmDialog.memberName} from this organisation?`}
                        confirmText="Remove"
                        variant="destructive"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default OrganisationsDialog;
