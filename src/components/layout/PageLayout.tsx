import Navbar from "@/components/Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
  showStarfield?: boolean;
}

export default function PageLayout({ children, showStarfield = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showStarfield && <div className="starfield" />}
      <Navbar />
      {children}
    </div>
  );
}
