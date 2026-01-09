import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "@/components/auth-provider";
import NotFound from "@/pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Test from "@/pages/Test";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Routes>
                    {/* public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />

                    {/* authed routes */}
                    <Route
                        path="/app"
                        element={
                            <Auth>
                                <Index />
                            </Auth>
                        }
                    />
                    <Route
                        path="/test"
                        element={
                            <Auth>
                                <Test />
                            </Auth>
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
