import { Home, ShoppingBag, Compass, MessageSquare, User, LucideIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type Item = { id: string; label: string; icon: LucideIcon; path: string };

const items: Item[] = [
  { id: "feed", label: "Home", icon: Home, path: "/feed" },
  { id: "store", label: "Store", icon: ShoppingBag, path: "/store" },
  { id: "discover", label: "Discover", icon: Compass, path: "/discover" },
  { id: "chat", label: "Chat", icon: MessageSquare, path: "/chat" },
  { id: "profile", label: "You", icon: User, path: "/profile" },
];

/**
 * Persistent glass bottom tab nav. Single source of truth for primary nav.
 * Active state derived from current route — no per-screen state needed.
 */
const BottomTabNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-card/75 backdrop-blur-2xl border-t border-border/40 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label="Primary"
    >
      <div className="flex items-stretch justify-around max-w-md mx-auto">
        {items.map((item) => {
          const active =
            pathname === item.path || pathname.startsWith(item.path + "/");
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl transition-all duration-300"
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
            >
              <span
                className={`flex items-center justify-center h-9 w-9 rounded-2xl transition-all duration-300 ${
                  active
                    ? "bg-primary/12 text-primary scale-105"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.4 : 1.8} />
              </span>
              <span
                className={`text-[10px] leading-none font-semibold tracking-wide transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-primary/80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabNav;