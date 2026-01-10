import { Moon, ShoppingCart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const router = useRouter();
  const { getCartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = getCartCount();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/marketplace", label: "Cards" },
    { href: "/my-cards", label: "My Cards" },
    { href: "/collection", label: "Collection" },
    { href: "/community", label: "Community" },
    { href: "/auctions", label: "Auctions" },
    { href: "/contact", label: "Contact" },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-secondary/20 border-b border-border hidden lg:block">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-xs xl:text-sm text-muted-foreground">
          <div className="flex gap-3 lg:gap-4 xl:gap-6">
            <span className="hidden xl:inline">📍 Tukad Balian No.19 Denpasar, Bali</span>
            <span className="xl:hidden">📍 Denpasar, Bali</span>
            <span className="hidden lg:inline">✉️ pandoora@domain.com</span>
            <span className="hidden lg:inline">📞 +62-311-89-90-19</span>
          </div>
          <div className="flex gap-3 lg:gap-4">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-70 sm:w-[320px]">
                <SheetHeader className="mb-6">
                  <SheetTitle className="flex items-center gap-2 text-2xl font-serif text-gradient-gold">
                    <Moon className="w-7 h-7 text-primary" />
                    PixelMage
                  </SheetTitle>
                </SheetHeader>
                
                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleNavClick}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/10"
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  {/* Mobile User Section */}
                  <div className="pt-6 border-t border-border space-y-3">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                          <User className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">Hi, {user?.username}</span>
                        </div>
                        <Link
                          href="/profile"
                          onClick={handleNavClick}
                          className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/10"
                        >
                          My Profile
                        </Link>
                      </>
                    ) : (
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Login / Register
                      </Button>
                    )}
                  </div>
                  
                  {/* Mobile Contact Info */}
                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">📍 Denpasar, Bali</p>
                    <p className="flex items-center gap-2">✉️ pandoora@domain.com</p>
                    <p className="flex items-center gap-2">📞 +62-311-89-90-19</p>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
              <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <span className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-gradient-gold">PixelMage</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 text-sm xl:text-base">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => router.push("/checkout")}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Button>
            {isAuthenticated ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon" title={user?.username}>
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="w-5 h-5" />
              </Button>
            )}
            {isAuthenticated ? (
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">Hi, {user?.username}</span>
            ) : (
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow text-xs sm:text-sm px-3 sm:px-4"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>      <LoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
