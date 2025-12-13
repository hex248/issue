import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./Index";
import Test from "./Test";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/test" element={<Test />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
