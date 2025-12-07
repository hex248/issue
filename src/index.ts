import { db, testDB } from "./db/client";
import { User } from "./db/schema";

const DEV = process.argv.find((arg) => ["--dev", "--developer", "-d"].includes(arg.toLowerCase())) != null;
const PORT = process.argv.find((arg) => arg.toLowerCase().startsWith("--port="))?.split("=")[1] || "3500";

const main = async () => {
    const server = Bun.serve({
        port: Number(PORT),
        routes: {
            "/": () => new Response(`title: eussi\ndev-mode: ${DEV}\nport: ${PORT}`),
        },
    });

    console.log(`eussi (issue server) listening on ${server.url}`);
    await testDB();

    const users = await db.select().from(User);
    console.log(`serving ${users.length} user${users.length === 1 ? "" : "s"}`);
};

main();
