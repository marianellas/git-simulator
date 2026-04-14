import { useRepo } from '../../state/repoContext';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div
        style={{
          fontSize: '10px',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.4rem',
          padding: '0 0.75rem',
        }}
      >
        {title}
      </div>
      <div style={{ padding: '0 0.75rem' }}>{children}</div>
    </div>
  );
}

export function InternalsPanel() {
  const { state } = useRepo();
  const { commits, branches, tags, HEAD, index } = state;

  const headHash =
    HEAD.type === 'branch' ? branches[HEAD.name] : HEAD.hash;
  const headCommit = headHash ? commits[headHash] : null;
  const headSnapshot = headCommit?.treeSnapshot ?? {};

  // Staged files: in index but different from HEAD snapshot
  const stagedFiles = Object.keys(index).filter(
    (f) => index[f] !== headSnapshot[f],
  );
  // Deleted files: in HEAD but not in index
  const deletedFiles = Object.keys(headSnapshot).filter((f) => !(f in index));

  return (
    <div
      style={{
        background: '#0a0f1a',
        color: '#e2e8f0',
        fontFamily: 'monospace',
        fontSize: '12px',
        height: '100%',
        overflowY: 'auto',
        paddingTop: '0.75rem',
      }}
    >
      {/* Staging area */}
      <Section title="Staging Area (Index)">
        <div
          style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '6px',
            padding: '0.4rem 0.5rem',
            minHeight: '32px',
          }}
        >
          {stagedFiles.length === 0 && deletedFiles.length === 0 ? (
            <span style={{ color: '#334155' }}>nothing staged</span>
          ) : (
            <>
              {stagedFiles.map((f) => (
                <div key={f} style={{ color: '#4ade80' }}>
                  + {f}
                </div>
              ))}
              {deletedFiles.map((f) => (
                <div key={f} style={{ color: '#f87171' }}>
                  - {f}
                </div>
              ))}
            </>
          )}
        </div>
      </Section>

      {/* Next commit preview */}
      <Section title="Next Commit Preview">
        <div
          style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '6px',
            padding: '0.5rem',
            lineHeight: '1.7',
          }}
        >
          <div>
            <span style={{ color: '#64748b' }}>hash: </span>
            <span style={{ color: '#f59e0b' }}>(pending)</span>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>parent: </span>
            <span style={{ color: '#94a3b8' }}>{headHash ?? 'none'}</span>
          </div>
          <div style={{ color: '#64748b', marginTop: '0.25rem' }}>tree:</div>
          {Object.keys(index).length === 0 ? (
            <div style={{ color: '#334155', paddingLeft: '0.75rem' }}>empty</div>
          ) : (
            Object.keys(index).map((f) => (
              <div key={f} style={{ color: '#94a3b8', paddingLeft: '0.75rem' }}>
                {f}
              </div>
            ))
          )}
        </div>
      </Section>

      {/* Branches */}
      <Section title="Branches">
        <div
          style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          {Object.keys(branches).length === 0 &&
          !(HEAD.type === 'branch' && !(HEAD.name in branches)) ? (
            <div style={{ padding: '0.4rem 0.5rem', color: '#334155' }}>
              no branches
            </div>
          ) : (
            (() => {
              const allBranches = new Set([
                ...Object.keys(branches),
                ...(HEAD.type === 'branch' ? [HEAD.name] : []),
              ]);
              return [...allBranches].map((name) => {
                const hash = branches[name];
                const isCurrent = HEAD.type === 'branch' && HEAD.name === name;
                return (
                  <div
                    key={name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.3rem 0.5rem',
                      borderBottom: '1px solid #1e293b',
                      background: isCurrent ? '#0f1f38' : 'transparent',
                    }}
                  >
                    <span style={{ color: isCurrent ? '#93c5fd' : '#94a3b8' }}>
                      {isCurrent ? '* ' : '  '}
                      {name}
                    </span>
                    <span style={{ color: '#475569' }}>{hash ?? '—'}</span>
                  </div>
                );
              });
            })()
          )}
        </div>
      </Section>

      {/* Tags */}
      {Object.keys(tags).length > 0 && (
        <Section title="Tags">
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            {Object.entries(tags).map(([name, hash]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.3rem 0.5rem',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                <span style={{ color: '#fcd34d' }}>{name}</span>
                <span style={{ color: '#475569' }}>{hash}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
