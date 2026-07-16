// A soft, slow-drifting aurora backdrop — two blurred accent blobs behind a
// section. Purely decorative (aria-hidden), CSS-animated so it costs nothing
// on the main thread. Hidden below md: 120px blurs are a phone-GPU tax.
export default function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 hidden overflow-hidden md:block ${className}`}
    >
      <div
        className="animate-aurora absolute -left-[10%] top-[-20%] h-[55%] w-[55%] rounded-full opacity-50 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgb(var(--mint)) 0%, transparent 70%)" }}
      />
      <div
        className="animate-aurora absolute -right-[10%] bottom-[-20%] h-[55%] w-[55%] rounded-full opacity-40 blur-[120px] [animation-delay:-9s]"
        style={{ background: "radial-gradient(circle, rgb(var(--electric)) 0%, transparent 70%)" }}
      />
    </div>
  );
}
