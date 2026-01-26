import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { label: "Decks", to: "/decks" },
  { label: "Heatmap", to: "/heatmap" },
  { label: "Lesson", to: "/lesson" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const brand = useMemo(() => "Personalized Learning", []);

  const handleLogout = () => {
    logout();
    navigate("/landing");
  };

  const renderLinks = (className: string) => (
    <div className={className}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive ? "text-primary" : "text-foreground hover:text-primary"
            }`
          }
          onClick={() => setOpen(false)}
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );

  return (
    <nav className="border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-lg md:text-xl font-bold tracking-tight">
          {brand}
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {renderLinks("flex items-center gap-2")}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground">
                {user?.firstName || user?.username || "User"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/decks")}
              >
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => navigate("/login")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {renderLinks("flex flex-col gap-1")}
            <div className="flex flex-col gap-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/decks");
                      setOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/login");
                      setOpen(false);
                    }}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/landing");
                      setOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
