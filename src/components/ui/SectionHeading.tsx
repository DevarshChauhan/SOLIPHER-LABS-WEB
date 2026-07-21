export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${className ?? ""}`}>
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-400">
          <span className="h-1 w-1 rounded-full bg-red-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "red" | "green" }) {
  const tones = {
    neutral: "border-border text-muted",
    red: "border-red-500/40 text-red-400 bg-red-500/5",
    green: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
