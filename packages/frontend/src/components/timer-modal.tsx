import { Timer } from "lucide-react";
import { useState } from "react";
import { IssueTimer } from "@/components/issue-timer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function TimerModal({ issueId }: { issueId: number }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Timer className="size-4" />
                    Timer
                </Button>
            </DialogTrigger>
            <DialogContent className="w-xs" showCloseButton={false}>
                <IssueTimer issueId={issueId} onEnd={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
