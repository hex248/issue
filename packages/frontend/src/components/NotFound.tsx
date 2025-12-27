import { CircleQuestionMark } from "lucide-react";

export default function NotFound() {
    return (
        <div className={`w-full h-[100vh] flex flex-col items-center justify-center gap-4`}>
            <CircleQuestionMark size={72} />
            <span className="text-7xl font-500">404</span>
            <span className="text-2xl font-400">Not Found</span>
        </div>
    );
}
