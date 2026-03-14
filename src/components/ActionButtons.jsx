
const MegaphoneIcon = () => (
  <svg className="w-7 h-7 text-neon-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-7 h-7 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-5 h-5 text-muted-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>
);

const HeartIcon = () => (
  <svg className="w-7 h-7 text-neon-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

export default function ActionButtons() {
  const actions = [
    {
      icon: <MegaphoneIcon />,
      title: 'BE PART OF THE CHANGE',
      description: 'Demand world leaders establish enforceable carbon caps for fossil fuel majors',
      borderColor: 'border-neon-red',
      hoverBg: 'hover:bg-neon-red/10',
      iconBg: 'bg-neon-red/10',
      titleColor: 'text-neon-red',
      href: 'https://www.pacificenvironment.org/',
    },
    {
      icon: <PhoneIcon />,
      title: 'CONTACT YOUR REPRESENTATIVE',
      description: 'Demand they support carbon tax legislation and renewable energy investment',
      borderColor: 'border-neon-cyan',
      hoverBg: 'hover:bg-neon-cyan/10',
      iconBg: 'bg-neon-cyan/10',
      titleColor: 'text-neon-cyan',
      href: 'https://citizensclimatelobby.org/write-your-representative/#/74/',
    },
    {
      icon: <HeartIcon />,
      title: 'SUPPORT THIS PROJECT',
      description: 'Help keep this tracker running! Contribute to development and hosting costs',
      borderColor: 'border-neon-orange',
      hoverBg: 'hover:bg-neon-orange/10',
      iconBg: 'bg-neon-orange/10',
      titleColor: 'text-neon-orange',
      href: 'https://ko-fi.com/anthonyarseneau/goal?g=15',
    },
    {
      icon: <EnvelopeIcon />,
      title: 'CONTACT ME',
      description: 'Have questions, feedback, or ideas? Send me an email',
      borderColor: 'border-white/30',
      hoverBg: 'hover:bg-white/5',
      iconBg: 'bg-white/10',
      titleColor: 'text-white',
      href: 'mailto:contact@anthonyarseneau.ca',
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        SUPPORT ENVIRONMENTAL ACTION
      </h2>
      
      <div className="space-y-4">
        {actions.map((action) => (
          <a 
            key={action.title}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`action-btn block border-2 ${action.borderColor} rounded-lg bg-dark-card p-6 ${action.hoverBg} transition-all`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full ${action.iconBg} flex items-center justify-center flex-shrink-0`}>
                {action.icon}
              </div>
              <div className="flex-grow">
                <p className={`${action.titleColor} font-semibold tracking-[0.15em] mb-1`}>
                  {action.title}
                </p>
                <p className="text-sm text-muted-text">{action.description}</p>
              </div>
              <ExternalLinkIcon />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
