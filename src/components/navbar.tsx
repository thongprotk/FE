import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Navbar() {
    return (
        <nav className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="text-xl font-bold">
                    Logo
                </div>

                {/* Desktop Menu */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/" className="px-4 py-2 hover:text-primary">
                                Home
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/landing" className="px-4 py-2 hover:text-primary">
                                Landing
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/review" className="px-4 py-2 hover:text-primary">
                                Review
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/heatmap" className="px-4 py-2 hover:text-primary">
                                Heatmap
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/extension" className="px-4 py-2 hover:text-primary">
                                Extension
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="hidden md:inline-flex">
                        Login
                    </Button>
                    <Button>Sign Up</Button>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}
