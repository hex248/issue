const path = require("node:path");

const backendPort = Number(process.env.BACKEND_PORT || 3000);
const frontendPort = Number(process.env.FRONTEND_PORT || 1420);

module.exports = {
    apps: [
        {
            name: "issue-backend",
            cwd: path.join(__dirname, "packages", "backend"),
            script: "bun",
            args: `src/index.ts --PORT=${backendPort}`,
            interpreter: "none",
            exec_mode: "fork",
            instances: 1,
            autorestart: true,
            watch: false,
            restart_delay: 2000,
            max_restarts: 10,
            kill_timeout: 5000,
            time: true,
        },
        {
            name: "issue-frontend",
            cwd: path.join(__dirname, "packages", "frontend"),
            script: "bun",
            args: `run preview -- --host 0.0.0.0 --port ${frontendPort}`,
            interpreter: "none",
            exec_mode: "fork",
            instances: 1,
            autorestart: true,
            watch: false,
            restart_delay: 2000,
            max_restarts: 10,
            kill_timeout: 5000,
            time: true,
        },
    ],
};
