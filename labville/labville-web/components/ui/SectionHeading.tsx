import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  align?: "left" | "center" | "right";
  theme?: "dark" | "light";
  gradientWord?: string; // word in headline to apply gradient
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  headline,
  subheadline,
  align = "left",
  theme = "dark",
  gradientWord,
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  // Split headline around the gradientWord if provided
  const renderHeadline = () => {
    if (!gradientWord) return headline;
    const idx = headline.indexOf(gradientWord);
    if (idx === -1) return headline;
    const prefix = headline.slice(0, idx);
    const suffix = headline.slice(idx + gradientWord.length);
    return (
      <>
        {prefix}
        <span className="gradient-text">{gradientWord}</span>
        {suffix}
      </>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" && "items-center text-center",
        align === "right" && "items-end text-right",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-eyebrow uppercase tracking-[0.12em] font-semibold mb-4",
            isDark ? "text-accent-cyan" : "text-accent-blue",
          )}
        >
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "text-section-xl font-semibold leading-[1.1] tracking-tight",
          isDark ? "text-white" : "text-text-dark",
        )}
      >
        {renderHeadline()}
      </h2>

      {subheadline && (
        <p
          className={cn(
            "text-body-lg mt-5 max-w-2xl",
            isDark ? "text-text-secondary" : "text-text-dark-secondary",
            align === "center" && "mx-auto",
          )}
        >
          {subheadline}
        </p>
      )}
    </div>
  );
}
