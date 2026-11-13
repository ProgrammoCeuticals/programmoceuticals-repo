import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Controls max-width: 'wide' = 1400px, 'content' = 1200px, 'narrow' = 800px */
  width?: "wide" | "content" | "narrow";
  /** Vertical padding preset */
  py?: boolean;
  /** HTML element to render as */
  as?: "section" | "div" | "article" | "aside";
  /** Background class(es) passed to the outer tag */
  bg?: string;
  /** HTML id attribute on the outer tag */
  id?: string;
}

export default function SectionContainer({
  children,
  className,
  width = "content",
  py = true,
  as: Tag = "section",
  bg,
  id,
}: SectionContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "w-full",
        py && "py-[clamp(64px,8vw,128px)]",
        bg,
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto px-[clamp(20px,5vw,80px)]",
          width === "wide" && "max-w-[1400px]",
          width === "content" && "max-w-[1200px]",
          width === "narrow" && "max-w-[800px]",
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
