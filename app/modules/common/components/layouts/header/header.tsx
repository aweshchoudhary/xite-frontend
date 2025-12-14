import MobileNavigation from "./mobile-navigation";
import TopBar from "./top-bar";

export default function Header() {
  return (
    <header className="bg-background">
      <TopBar />
      <MobileNavigation />
    </header>
  );
}
