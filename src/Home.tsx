import { useState } from "react";
import { Button } from "@/components/ui/button";

function Home() {
    const [issues, setIssues] = useState([]);
    const [serverURL, setServerURL] = useState("http://localhost:3000");

    async function getIssues() {
        const res = await fetch(`${serverURL}/issues/all`);
    }

    return (
        <main className="w-full h-[100vh] flex flex-col items-center justify-center gap-4 p-4">
            <h1>Issue Project Manager</h1>

            <Button onClick={getIssues} className={""}>
                get issues
            </Button>

            <div>Issues count: {issues.length}</div>
            {issues.length > 0 && (
                <ul>
                    {issues.map((issue: any) => (
                        <li key={issue.id}>{issue.title}</li>
                    ))}
                </ul>
            )}
        </main>
    );
}

export default Home;
