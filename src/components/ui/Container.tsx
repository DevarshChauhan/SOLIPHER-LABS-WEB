export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 lg:px-8 2xl:max-w-[1440px] ${className ?? ""}`}>
      {children}
    </div>
  );
}
