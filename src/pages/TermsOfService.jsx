import NavBar from '../components/NavBar';

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing or using this website ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the Service immediately. These terms apply to all visitors and users of the Service.',
  },
  {
    title: 'Nature of the Service',
    body: 'This website provides informational estimates of global greenhouse gas emissions and remaining carbon budgets. All data and figures are educational in nature, based on publicly available scientific publications. The Service is not a certified measurement instrument and should not be used for policy, legal, regulatory, or financial decisions.',
  },
  {
    title: 'Intellectual Property',
    body: 'The source code for this project is open-source (see the GitHub repository for licence details). Data presented originates from third-party scientific organisations (WMO, IPCC, GCP, Berkeley Earth) and remains the intellectual property of those organisations. No commercial use of raw data is authorised by this project.',
  },
  {
    title: 'Disclaimer of Warranties',
    body: 'The Service is provided "as is" without warranties of any kind, express or implied. We make no guarantees regarding the accuracy, completeness, timeliness, or reliability of any information presented. Emission figures are estimates derived from published annual totals and may not reflect real-time conditions.',
  },
  {
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, the operators of this Service shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, the Service or the information it provides.',
  },
  {
    title: 'Third-Party Links',
    body: 'The Service may contain links to external websites, including data sources and educational resources. We are not responsible for the content, accuracy, or privacy practices of any third-party sites. Links are provided for informational purposes only.',
  },
  {
    title: 'Changes to Terms',
    body: 'We reserve the right to update or modify these Terms of Service at any time. Continued use of the Service after any changes constitutes your acceptance of the revised terms. Material changes will be reflected on this page with an updated revision date.',
  },
  {
    title: 'Governing Law',
    body: 'These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from use of the Service shall be subject to the exclusive jurisdiction of the relevant courts.',
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen text-white">
      <div className="noise-overlay" />
      <div className="grid-overlay" />
      <NavBar />

      <main className="max-w-[900px] mx-auto px-4 py-12 relative z-10">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.3em] text-muted-text font-mono mb-3">
            Legal · Terms of Service
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest font-mono mb-2">
            Terms of Service
          </h1>
          <p className="text-xs text-muted-text font-mono tracking-widest">
            Last Updated: March 2026
          </p>
        </div>

        {/* Terms sections */}
        <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden">
          {SECTIONS.map((s, i) => (
            <div
              key={i}
              className={`px-6 py-5 ${i < SECTIONS.length - 1 ? 'border-b border-dark-border/50' : ''}`}
            >
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-slate-200 mb-2">
                {String(i + 1).padStart(2, '0')}. {s.title}
              </h2>
              <p className="text-muted-text text-xs font-mono leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Contact note */}
        {/* <div className="mt-8 border border-dark-border/50 rounded-xl bg-slate-950/60 px-6 py-5">
          <p className="text-[10px] tracking-[0.3em] text-muted-text uppercase font-mono mb-2">
            QUESTIONS?
          </p>
          <p className="text-muted-text text-xs font-mono leading-relaxed">
            If you have questions about these Terms of Service, please reach out via the{' '}
            <a
              href="mailto:contact@emissionsbudget.com"
              className="text-neon-cyan hover:underline"
            >
              contact email
            </a>
            .
          </p>
        </div> */}

      </main>
    </div>
  );
}
