export default function MultiplierPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full mb-6 font-bold text-sm tracking-widest uppercase" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
        In Development
      </div>
      <h1 className="text-5xl font-extrabold mb-4" style={{ color: "var(--text-primary)" }}>The Multiplier</h1>
      <p className="text-xl max-w-lg" style={{ color: "var(--text-muted)" }}>
        Drop an hour-long video. The AI transcribes it, finds the virality hooks, and generates LinkedIn posts, Twitter threads, and blog drafts instantly.
      </p>
    </div>
  );
}
