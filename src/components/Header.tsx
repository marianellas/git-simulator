type Props = {
  currentStep?: number;
  totalSteps?: number;
  scenarioLabel?: string;
};

export function Header({ currentStep = 1, totalSteps = 4, scenarioLabel = 'Free Sandbox' }: Props) {
  return (
    <div
      style={{
        height: '44px',
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        gap: '1rem',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontWeight: 600, fontSize: '14px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <circle cx="4" cy="6" r="2" />
          <circle cx="20" cy="6" r="2" />
          <circle cx="4" cy="18" r="2" />
          <line x1="6" y1="6" x2="10" y2="10" />
          <line x1="14" y1="14" x2="18" y2="6" />
          <line x1="6" y1="18" x2="10" y2="14" />
        </svg>
        Git Simulator
      </div>

      {/* Scenario badge */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '0.25rem 0.75rem',
            fontSize: '13px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          Scenario:
          <span style={{ color: '#e2e8f0' }}>{scenarioLabel}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px', color: '#64748b' }}>
        <span>Step</span>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 600,
              background: step === currentStep ? '#3b82f6' : '#1e293b',
              color: step === currentStep ? '#fff' : '#475569',
              border: step < currentStep ? '1px solid #3b82f6' : '1px solid transparent',
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
