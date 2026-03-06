import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, LayoutDashboard, LogOut, Menu, Moon, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/marketplace", label: "Thẻ bài" },
    { href: "/my-cards", label: "Thẻ của tôi" },
    { href: "/collection", label: "Bộ sưu tập" },
    { href: "/community", label: "Cộng đồng" },
    { href: "/auctions", label: "Đấu giá" },
    { href: "/contact", label: "Liên hệ" },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "bg-background/40 backdrop-blur-xl border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-background/0 border-transparent"
        }`}>
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
                  <SheetTitle className="flex items-center gap-2 text-2xl font-serif text-gradient-gold tracking-widest drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                    <Moon className="w-7 h-7" />
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
                          <span className="text-sm font-medium">Xin chào, {user?.username}</span>
                        </div>
                        <Link
                          href="/profile"
                          onClick={handleNavClick}
                          className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/10"
                        >
                          Hồ sơ của tôi
                        </Link>
                        <Link
                          href="/orders"
                          onClick={handleNavClick}
                          className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/10"
                        >
                          Đơn hàng
                        </Link>
                        <button
                          onClick={async () => { handleNavClick(); await logout(); }}
                          className="flex items-center gap-2 w-full text-lg font-medium text-destructive hover:text-destructive/80 transition-colors py-2 px-3 rounded-lg hover:bg-destructive/10 text-left"
                        >
                          <LogOut className="w-5 h-5" />
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push("/login");
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Đăng nhập / Đăng ký
                      </Button>
                    )}
                  </div>

                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
              <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] transition-all" />
              <span className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-gradient-gold tracking-widest drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">PixelMage</span>
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
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3" title={user?.username}>
                    <User className="w-5 h-5" />
                    <span className="text-xs sm:text-sm hidden md:inline max-w-[120px] truncate">
                      {user?.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 backdrop-blur-md bg-background/70 border border-border/50 shadow-xl">
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="w-4 h-4" />
                      Hồ sơ của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
                      <Clock className="w-4 h-4" />
                      Đơn hàng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/login")}
              >
                <User className="w-5 h-5" />
              </Button>
            )}
            {!isAuthenticated && (
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow text-xs sm:text-sm px-3 sm:px-4"
                onClick={() => router.push("/login")}
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </nav>    </>
  );
};

export default Navbar;
