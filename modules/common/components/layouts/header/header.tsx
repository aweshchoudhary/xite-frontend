import MobileNavigation from "./mobile-navigation";
import TopBar from "./top-bar";

export default function Header() {
  return (
    <header className="bg-sidebar">
      <TopBar />
      <MobileNavigation />
    </header>
  );
}
