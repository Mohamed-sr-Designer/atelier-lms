export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-ultra text-bone-400">
      <span className="text-mint">{index}</span>
      <span className="h-px w-8 bg-line/25" />
      <span>{children}</span>
    </div>
  );
}
