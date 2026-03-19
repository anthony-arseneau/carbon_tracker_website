import NavBar from '../components/NavBar';

export default function Privacy() {
  return (
    <div className="min-h-screen text-white">
      <div className="noise-overlay" />
      <div className="grid-overlay" />
      <NavBar />

      <main className="max-w-[900px] mx-auto px-4 py-8 relative z-10">
        <div className="border border-dark-border rounded-xl bg-dark-card p-7 glow-orange">
          <p className="text-xs tracking-[0.26em] text-muted-text mb-4 uppercase">Privacy Policy</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-wide">How Your Data Is Handled</h1>

          <h2 className="text-base font-semibold mt-5 mb-2 tracking-wide">Data Collection</h2>
          <p className="text-muted-text leading-relaxed mb-4">
            This website is informational and does not require account creation. By default, we do not
            collect personal information directly through forms on this page.
          </p>

          <h2 className="text-base font-semibold mt-5 mb-2 tracking-wide">Analytics</h2>
          <p className="text-muted-text leading-relaxed mb-4">
            If analytics tools are used, they may collect limited technical data such as browser type,
            device type, and anonymous usage patterns to improve site performance and reliability.
          </p>

          <h2 className="text-base font-semibold mt-5 mb-2 tracking-wide">Third-Party Links</h2>
          <p className="text-muted-text leading-relaxed mb-4">
            External links (for example donation or educational resources) lead to third-party sites
            with their own privacy practices. Please review their policies separately.
          </p>

          <h2 className="text-base font-semibold mt-5 mb-2 tracking-wide">Policy Updates</h2>
          <p className="text-muted-text leading-relaxed mb-4">
            This policy may be updated as the project evolves. Material changes will be reflected on
            this page.
          </p>


        </div>
      </main>
    </div>
  );
}
