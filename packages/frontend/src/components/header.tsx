import type { UserRecord } from "@issue/shared";
import { Link } from "react-router-dom";
import LogOutButton from "@/components/log-out-button";
import { ServerConfigurationDialog } from "@/components/server-configuration-dialog";
import SmallUserDisplay from "@/components/small-user-display";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ user, children }: { user: UserRecord; children?: React.ReactNode }) {
    return (
        <div className="flex gap-12 items-center justify-between p-1">
            {children}
            <div className="flex gap-1 items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-sm">
                        <SmallUserDisplay user={user} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"}>
                        <DropdownMenuItem asChild className="flex items-end justify-end">
                            <Link to="/" className="p-0 text-end">
                                Home
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="flex items-end justify-end">
                            <Link to="/settings/account" className="p-0 text-end">
                                My Account
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="flex items-end justify-end">
                            <Link to="/settings/organisations" className="p-0 text-end">
                                My Organisations
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="flex items-end justify-end">
                            <ServerConfigurationDialog
                                trigger={
                                    <Button
                                        variant="ghost"
                                        className="flex w-full gap-2 items-center justify-end text-end px-2 py-1 m-0 h-auto"
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
    );
}
