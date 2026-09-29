export default function LensPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full mb-6 font-bold text-sm tracking-widest uppercase" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
        In Development
      </div>
      <h1 className="text-5xl font-extrabold mb-4" style={{ color: "var(--text-primary)" }}>The Lens</h1>
      <p className="text-xl max-w-lg" style={{ color: "var(--text-muted)" }}>
        Upload a CSV and let the autonomous AI Analyst execute Python locally to find hidden correlations and generate interactive charts.
      </p>
    </div>
  );
}
