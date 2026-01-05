import { ThemeProvider } from "@/components/theme-provider.tsx";
import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/error-boundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme={"light"} storageKey="vite-ui-theme">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
