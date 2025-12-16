import {ThemeProvider} from "@/components/theme-provider.tsx";
import {RouterProvider} from "react-router-dom"
import router from "@/routes";

function App() {
    return (
        <ThemeProvider defaultTheme={"light"} storageKey="vite-ui-theme">
            <RouterProvider router={router}/>
        </ThemeProvider>
    )
}

export default App
