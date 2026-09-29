export default function ArchitectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full mb-6 font-bold text-sm tracking-widest uppercase" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
        In Development
      </div>
      <h1 className="text-5xl font-extrabold mb-4" style={{ color: "var(--text-primary)" }}>The Architect</h1>
      <p className="text-xl max-w-lg" style={{ color: "var(--text-muted)" }}>
        Describe a UI layout. The AI generates the underlying React and Tailwind code, rendering a live interactive preview right in your browser.
      </p>
    </div>
  );
}
