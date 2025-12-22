export default function Loading({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 w-full h-[100vh]">
            <h1>Loading...</h1>
            {children}
        </div>
    );
}
