import { ThemeProvider } from "@/components/theme-provider";

import Home from "./Home";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Home />
        </ThemeProvider>
    );
}

export default App;
