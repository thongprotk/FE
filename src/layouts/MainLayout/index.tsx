import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
