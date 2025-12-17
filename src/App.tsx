import { ThemeProvider } from "@/components/theme-provider.tsx";
import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <ThemeProvider defaultTheme={"light"} storageKey="vite-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
