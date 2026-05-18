import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  /** Right-side action(s). */
  action?: ReactNode;
  /** Show the default "more" button on the right when no action is provided. */
  showMore?: boolean;
  onMore?: () => void;
  /** Transparent overlay variant for media/hero screens. */
  transparent?: boolean;
}

/**
 * Sticky glass header used on every detail screen for consistent back-nav.
 */
const ScreenHeader = ({
  title,
  subtitle,
  onBack,
  action,
  showMore = false,
  onMore,
  transparent = false,
}: ScreenHeaderProps) => {
  const navigate = useNavigate();
  const handleBack = () => (onBack ? onBack() : navigate(-1));

  return (
    <header
      className={`sticky top-0 z-30 flex items-center gap-2 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 ${
        transparent
          ? "bg-gradient-to-b from-black/40 to-transparent"
          : "bg-card/75 backdrop-blur-2xl border-b border-border/40"
      }`}
    >
      <button
        onClick={handleBack}
        aria-label="Back"
        className={`h-10 w-10 -ml-1 inline-flex items-center justify-center rounded-2xl transition-colors ${
          transparent
            ? "text-white hover:bg-white/15"
            : "text-foreground hover:bg-muted/60"
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0 px-1">
        {title && (
          <h1
            className={`text-base font-bold leading-tight truncate ${
              transparent ? "text-white" : "text-foreground"
            }`}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            className={`text-xs truncate leading-tight ${
              transparent ? "text-white/80" : "text-muted-foreground"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {action}
        {!action && showMore && (
          <button
            onClick={onMore}
            aria-label="More"
            className={`h-10 w-10 inline-flex items-center justify-center rounded-2xl transition-colors ${
              transparent
                ? "text-white hover:bg-white/15"
                : "text-foreground hover:bg-muted/60"
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default ScreenHeader;