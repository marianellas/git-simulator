import { useRepo } from '../../state/repoContext';

export function GraphPanel() {
  const { state } = useRepo();
  const { commits, branches, HEAD } = state;

  const headHash =
    HEAD.type === 'branch' ? branches[HEAD.name] : HEAD.hash;
  const headBranch = HEAD.type === 'branch' ? HEAD.name : null;

  // Walk commits in reverse-chronological order from all branch tips
  const seen = new Set<string>();
  const ordered: string[] = [];
  const queue = [...new Set(Object.values(branches).filter(Boolean))];

  while (queue.length) {
    const hash = queue.shift()!;
    if (seen.has(hash)) continue;
    seen.add(hash);
    ordered.push(hash);
    const commit = commits[hash];
    if (commit) queue.push(...commit.parents);
  }

  const NODE_R = 10;
  const ROW_H = 56;
  const COL_X = 60;
  const SVG_W = 200;
  const SVG_H = Math.max(ordered.length * ROW_H + ROW_H, 100);

  return (
    <div
      style={{
        height: '100%',
        background: '#0f172a',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '0.5rem 0.75rem',
          borderBottom: '1px solid #1e293b',
          fontSize: '12px',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Commit Graph
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
        {ordered.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              color: '#334155',
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            No commits yet
          </div>
        ) : (
          <svg width={SVG_W} height={SVG_H} style={{ display: 'block' }}>
            {/* Edges */}
            {ordered.map((hash, i) => {
              const commit = commits[hash];
              return commit.parents.map((parentHash) => {
                const j = ordered.indexOf(parentHash);
                if (j === -1) return null;
                return (
                  <line
                    key={`${hash}-${parentHash}`}
                    x1={COL_X}
                    y1={ROW_H / 2 + i * ROW_H}
                    x2={COL_X}
                    y2={ROW_H / 2 + j * ROW_H}
                    stroke="#334155"
                    strokeWidth="2"
                  />
                );
              });
            })}

            {/* Nodes */}
            {ordered.map((hash, i) => {
              const cy = ROW_H / 2 + i * ROW_H;
              const isHead = hash === headHash;
              const commit = commits[hash];
              const branchLabels = Object.entries(branches)
                .filter(([, h]) => h === hash)
                .map(([name]) => name);

              return (
                <g key={hash}>
                  <circle
                    cx={COL_X}
                    cy={cy}
                    r={NODE_R}
                    fill={isHead ? '#3b82f6' : '#1e293b'}
                    stroke={isHead ? '#60a5fa' : '#334155'}
                    strokeWidth="2"
                  />
                  {/* Commit message */}
                  <text
                    x={COL_X + NODE_R + 8}
                    y={cy - 4}
                    fill="#94a3b8"
                    fontSize="11"
                  >
                    {commit.message.length > 20
                      ? commit.message.slice(0, 20) + '…'
                      : commit.message}
                  </text>
                  <text x={COL_X + NODE_R + 8} y={cy + 9} fill="#475569" fontSize="10">
                    {hash}
                  </text>

                  {/* Branch labels */}
                  {branchLabels.map((label, li) => (
                    <g key={label} transform={`translate(${COL_X - NODE_R - 6}, ${cy - 8 + li * 16})`}>
                      <rect
                        x={-label.length * 6 - 4}
                        y={0}
                        width={label.length * 6 + 8}
                        height={14}
                        rx="3"
                        fill={label === headBranch ? '#1d4ed8' : '#1e293b'}
                        stroke={label === headBranch ? '#3b82f6' : '#334155'}
                        strokeWidth="1"
                      />
                      <text
                        x={-label.length * 6 / 2}
                        y={10}
                        fill={label === headBranch ? '#93c5fd' : '#64748b'}
                        fontSize="9"
                        textAnchor="middle"
                      >
                        {label}
                      </text>
                    </g>
                  ))}

                  {/* HEAD arrow */}
                  {isHead && HEAD.type === 'detached' && (
                    <text x={COL_X - NODE_R - 10} y={cy + 4} fill="#f59e0b" fontSize="9" textAnchor="end">
                      HEAD
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
