function mulberry32(seed) {
  let value = seed
  return () => {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const NEBULA_POINTS = (() => {
  const random = mulberry32(20260214)
  return Array.from({ length: 240 }, () => {
    const angle = random() * Math.PI * 2
    const distance = Math.pow(random(), 1.55) * 245 + 18
    return {
      x: 320 + Math.cos(angle) * distance * 1.32,
      y: 200 + Math.sin(angle) * distance * 0.72,
      r: 0.5 + random() * 2.1,
      o: 0.16 + random() * 0.8,
    }
  })
})()

const NEBULA_LINKS = (() => {
  const random = mulberry32(99)
  return Array.from({ length: 10 }, () => {
    const a = NEBULA_POINTS[Math.floor(random() * NEBULA_POINTS.length)]
    const b = NEBULA_POINTS[Math.floor(random() * NEBULA_POINTS.length)]
    return { a, b }
  })
})()

const NETWORK_NODES = [
  { x: 320, y: 200, r: 9, label: 'GATEWAY', core: true },
  { x: 132, y: 118, r: 5, label: 'ROUTE' },
  { x: 508, y: 108, r: 5, label: 'JWT' },
  { x: 552, y: 244, r: 5, label: 'LIMIT' },
  { x: 448, y: 330, r: 5, label: 'CACHE' },
  { x: 214, y: 326, r: 5, label: 'GRPC' },
  { x: 92, y: 238, r: 5, label: 'ETCD' },
  { x: 320, y: 68, r: 5, label: 'TLS' },
]

const NETWORK_EDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [1, 5],
  [2, 7],
  [3, 4],
  [5, 6],
]

function TerrainVisual({ id, accent }) {
  const horizontals = Array.from({ length: 12 }, (_, index) => {
    const t = index / 11
    return 218 + Math.pow(t, 1.9) * 182
  })
  const verticals = Array.from({ length: 17 }, (_, index) => -420 + index * 112)

  return (
    <svg className="project-art" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070b14" />
          <stop offset="58%" stopColor="#0a1424" />
          <stop offset="100%" stopColor="#05080f" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="55%" stopColor={accent} stopOpacity="0.24" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-horizon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05080f" stopOpacity="0" />
          <stop offset="100%" stopColor="#05080f" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <rect width="640" height="400" fill={`url(#${id}-sky)`} />
      <circle cx="360" cy="200" r="150" fill={`url(#${id}-sun)`} />
      <circle cx="360" cy="200" r="46" fill={accent} opacity="0.55" />
      <circle cx="360" cy="200" r="46" fill={`url(#${id}-sun)`} />
      {Array.from({ length: 5 }, (_, index) => (
        <rect key={index} x="300" y={176 + index * 9} width="120" height={2 + index * 0.4} fill="#05080f" opacity="0.9" />
      ))}

      <path d="M0 212 L96 170 L150 196 L236 150 L292 190 L320 178 L370 208 L470 158 L540 194 L600 172 L640 200 L640 214 L0 214 Z" fill="#060a12" />
      <path d="M0 212 L96 170 L150 196 L236 150 L292 190 L320 178 L370 208 L470 158 L540 194 L600 172 L640 200" fill="none" stroke={accent} strokeOpacity="0.45" strokeWidth="1.1" />

      <rect x="0" y="212" width="640" height="2" fill={`url(#${id}-horizon)`} />
      <g stroke={accent} strokeOpacity="0.22" strokeWidth="1">
        {horizontals.map((y, index) => (
          <line key={index} x1="0" y1={y} x2="640" y2={y} />
        ))}
        {verticals.map((x, index) => (
          <line key={index} x1={x} y1="400" x2={320 + (x - 320) * 0.02} y2="214" />
        ))}
      </g>
      <rect y="214" width="640" height="186" fill={`url(#${id}-fade)`} />
      <g fill={accent} opacity="0.6">
        <circle cx="72" cy="96" r="1.4" />
        <circle cx="148" cy="62" r="1" />
        <circle cx="512" cy="84" r="1.3" />
        <circle cx="574" cy="132" r="1" />
        <circle cx="254" cy="54" r="0.9" />
      </g>
    </svg>
  )
}

function NebulaVisual({ id, accent }) {
  return (
    <svg className="project-art" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-bg`} cx="58%" cy="46%" r="65%">
          <stop offset="0%" stopColor="#1b1440" />
          <stop offset="45%" stopColor="#0b0a20" />
          <stop offset="100%" stopColor="#05060e" />
        </radialGradient>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="45%" stopColor={accent} stopOpacity="0.12" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#05060e" stopOpacity="0.7" />
          <stop offset="55%" stopColor="#05060e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill={`url(#${id}-bg)`} />
      <ellipse cx="370" cy="188" rx="230" ry="150" fill={`url(#${id}-core)`} transform="rotate(-18 370 188)" />
      <g transform="rotate(-18 370 188)">
        {NEBULA_LINKS.map((link, index) => (
          <line
            key={index}
            x1={link.a.x}
            y1={link.a.y}
            x2={link.b.x}
            y2={link.b.y}
            stroke={accent}
            strokeOpacity="0.16"
            strokeWidth="0.7"
          />
        ))}
        {NEBULA_POINTS.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={point.r} fill={index % 9 === 0 ? '#ffd8a8' : accent} opacity={point.o} />
        ))}
      </g>
      <g fill="none" stroke={accent} strokeOpacity="0.2" strokeWidth="0.8">
        <circle cx="370" cy="188" r="64" strokeDasharray="2 6" />
        <circle cx="370" cy="188" r="98" strokeDasharray="1 9" />
        <circle cx="370" cy="188" r="132" strokeDasharray="2 12" />
      </g>
      <rect width="640" height="400" fill={`url(#${id}-fade)`} />
      <g fill="#e8f4ff" opacity="0.75" fontFamily="'JetBrains Mono', monospace" fontSize="9" letterSpacing="1.5">
        <text x="34" y="366">RA 05h 35m 17s</text>
        <text x="512" y="52">DEC −05° 23′</text>
        <text x="516" y="366">1.2M PTS</text>
      </g>
    </svg>
  )
}

function ForgeVisual({ id, accent }) {
  const cube = (x, y, scale, opacity, key) => {
    const w = 48 * scale
    const h = 24 * scale
    const depth = 28 * scale
    return (
      <g key={key} opacity={opacity}>
        <path
          d={`M${x} ${y - h / 2} L${x + w} ${y} L${x} ${y + h / 2} L${x - w} ${y} Z`}
          fill={accent}
          fillOpacity="0.09"
          stroke={accent}
          strokeOpacity="0.8"
          strokeWidth="1"
        />
        <path
          d={`M${x - w} ${y} L${x} ${y + h / 2} L${x} ${y + h / 2 + depth} L${x - w} ${y + depth} Z`}
          fill={accent}
          fillOpacity="0.035"
          stroke={accent}
          strokeOpacity="0.42"
          strokeWidth="1"
        />
        <path
          d={`M${x + w} ${y} L${x} ${y + h / 2} L${x} ${y + h / 2 + depth} L${x + w} ${y + depth} Z`}
          fill={accent}
          fillOpacity="0.055"
          stroke={accent}
          strokeOpacity="0.42"
          strokeWidth="1"
        />
      </g>
    )
  }

  const cubes = []
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const x = 320 + (col - row) * 58
      const y = 168 + (col + row) * 33
      const center = row === 1 && col === 1
      cubes.push(cube(x, y, center ? 1.08 : 0.82, center ? 1 : 0.55, `${row}-${col}`))
    }
  }

  return (
    <svg className="project-art" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#241408" />
          <stop offset="55%" stopColor="#0e0a07" />
          <stop offset="100%" stopColor="#06070b" />
        </radialGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill={`url(#${id}-bg)`} />
      <g stroke={accent} strokeOpacity="0.08">
        {Array.from({ length: 9 }, (_, index) => (
          <line key={`h${index}`} x1="0" y1={40 + index * 40} x2="640" y2={40 + index * 40} />
        ))}
        {Array.from({ length: 13 }, (_, index) => (
          <line key={`v${index}`} x1={index * 50} y1="0" x2={index * 50} y2="400" />
        ))}
      </g>
      <circle cx="320" cy="190" r="170" fill={accent} opacity="0.05" />
      {cubes}
      <g stroke={`url(#${id}-edge)`} strokeWidth="1.4" fill="none">
        <path d="M320 56 L320 320" strokeDasharray="3 5" strokeOpacity="0.5" />
        <path d="M196 300 L444 300" strokeDasharray="2 6" strokeOpacity="0.35" />
        <circle cx="320" cy="56" r="2.5" fill={accent} stroke="none" />
        <circle cx="444" cy="300" r="2.5" fill={accent} stroke="none" />
        <circle cx="196" cy="300" r="2.5" fill={accent} stroke="none" />
      </g>
      <g fill="#ffe3c7" opacity="0.65" fontFamily="'JetBrains Mono', monospace" fontSize="9" letterSpacing="1.6">
        <text x="30" y="366">GEOMETRY NODES · 248</text>
        <text x="500" y="52">GLTF / BAKED</text>
      </g>
    </svg>
  )
}

function NetworkVisual({ id, accent }) {
  return (
    <svg className="project-art" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#07161d" />
          <stop offset="60%" stopColor="#060c12" />
          <stop offset="100%" stopColor="#05070b" />
        </radialGradient>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="400" fill={`url(#${id}-bg)`} />
      <circle cx="320" cy="200" r="190" fill={`url(#${id}-core)`} />
      <g stroke={accent} strokeWidth="1">
        {NETWORK_EDGES.map(([from, to], index) => (
          <line
            key={index}
            className="network-edge"
            x1={NETWORK_NODES[from].x}
            y1={NETWORK_NODES[from].y}
            x2={NETWORK_NODES[to].x}
            y2={NETWORK_NODES[to].y}
            strokeOpacity={0.16 + (index % 3) * 0.07}
            strokeDasharray={index % 2 === 0 ? '3 6' : undefined}
            style={{ animationDelay: `${index * 0.35}s` }}
          />
        ))}
      </g>
      {NETWORK_NODES.map((node, index) => (
        <g key={index}>
          {node.core ? (
            <>
              <circle cx={node.x} cy={node.y} r="46" fill="none" stroke={accent} strokeOpacity="0.22" strokeDasharray="2 5" />
              <circle cx={node.x} cy={node.y} r="32" fill="none" stroke={accent} strokeOpacity="0.35" />
              <circle cx={node.x} cy={node.y} r={node.r} fill={accent} opacity="0.9" />
            </>
          ) : (
            <>
              <circle cx={node.x} cy={node.y} r={node.r + 6} fill={accent} opacity="0.1" />
              <circle cx={node.x} cy={node.y} r={node.r} fill="#07161d" stroke={accent} strokeOpacity="0.85" strokeWidth="1.2" />
            </>
          )}
          <text
            x={node.x}
            y={node.y + (node.core ? 26 : 20)}
            textAnchor="middle"
            fill={node.core ? accent : '#9fc8d8'}
            fillOpacity={node.core ? 0.9 : 0.7}
            fontFamily="'JetBrains Mono', monospace"
            fontSize={node.core ? 6.5 : 5}
            letterSpacing="0.8"
          >
            {node.label}
          </text>
        </g>
      ))}
      <g fill="#8fe6ff" opacity="0.6" fontFamily="'JetBrains Mono', monospace" fontSize="9" letterSpacing="1.5">
        <text x="30" y="54">P99 · 8ms</text>
        <text x="512" y="366">120k QPS</text>
        <text x="30" y="366">GO 1.23</text>
      </g>
    </svg>
  )
}

function LedgerVisual({ id, accent }) {
  const rows = [
    { label: 'ORDER.CREATE', value: '86k', width: 0.82 },
    { label: 'PAY.CALLBACK', value: '64k', width: 0.62 },
    { label: 'INVENTORY.LOCK', value: '72k', width: 0.7 },
    { label: 'TCC.COMMIT', value: '94k', width: 0.94, active: true },
    { label: 'LEDGER.ENTRY', value: '58k', width: 0.56 },
    { label: 'SETTLE.BATCH', value: '42k', width: 0.4 },
    { label: 'RISK.CHECK', value: '51k', width: 0.49 },
  ]

  return (
    <svg className="project-art" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-bg`} cx="72%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#241a0e" />
          <stop offset="52%" stopColor="#0c0a12" />
          <stop offset="100%" stopColor="#06070c" />
        </radialGradient>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="1" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-300%" width="140%" height="700%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <rect width="640" height="400" fill={`url(#${id}-bg)`} />
      <g stroke="#ffffff" strokeOpacity="0.035">
        {Array.from({ length: 10 }, (_, index) => (
          <line key={`h${index}`} x1="0" y1={index * 44} x2="640" y2={index * 44} />
        ))}
        {Array.from({ length: 15 }, (_, index) => (
          <line key={`v${index}`} x1={index * 48} y1="0" x2={index * 48} y2="400" />
        ))}
      </g>

      <text x="612" y="356" textAnchor="end" fill={accent} fillOpacity="0.06" fontFamily="'JetBrains Mono', monospace" fontSize="104" fontWeight="700" letterSpacing="-6">
        3.0M
      </text>

      <g fontFamily="'JetBrains Mono', monospace" fontSize="8" letterSpacing="1.6">
        <text x="30" y="32" fill={accent} fillOpacity="0.85">ATLAS / TRANSACTION CORE</text>
        <text x="610" y="32" textAnchor="end" fill="#8fa0b8" fillOpacity="0.6">JVM · SPRING CLOUD</text>
      </g>

      <line x1="38" y1="66" x2="38" y2="330" stroke={accent} strokeOpacity="0.22" strokeDasharray="2 6" />

      {rows.map((row, index) => {
        const y = 84 + index * 36
        const tone = row.active ? accent : '#8fd3ff'
        return (
          <g key={row.label}>
            {row.active ? (
              <rect x="24" y={y - 14} width="592" height="28" rx="4" fill={accent} fillOpacity="0.08" />
            ) : null}
            <rect x="35" y={y - 3} width="6" height="6" fill={tone} fillOpacity={row.active ? 1 : 0.5} transform={`rotate(45 38 ${y})`} />
            <text x="56" y={y + 3} fill={row.active ? '#ffe4c8' : '#8e9bb0'} fontFamily="'JetBrains Mono', monospace" fontSize="7.5" letterSpacing="1">
              {row.label}
            </text>
            <rect x="200" y={y - 2} width="300" height="4" rx="2" fill="#ffffff" fillOpacity="0.06" />
            {row.active ? (
              <rect
                x="200"
                y={y - 2}
                width={300 * row.width}
                height="4"
                rx="2"
                fill={tone}
                fillOpacity="0.6"
                filter={`url(#${id}-glow)`}
              />
            ) : null}
            <rect x="200" y={y - 2} width={300 * row.width} height="4" rx="2" fill={`url(#${id}-bar)`} />
            <text x="612" y={y + 3} textAnchor="end" fill={tone} fillOpacity={row.active ? 0.95 : 0.55} fontFamily="'JetBrains Mono', monospace" fontSize="7.5">
              {row.value}
            </text>
          </g>
        )
      })}

      <g fontFamily="'JetBrains Mono', monospace" fontSize="8" letterSpacing="1.5" fill="#8fa0b8" fillOpacity="0.55">
        <text x="30" y="378">P99 · 46ms</text>
        <text x="320" y="378" textAnchor="middle">TCC · 2PC</text>
        <text x="610" y="378" textAnchor="end">300M REQ / DAY</text>
      </g>
    </svg>
  )
}

export default function ProjectVisual({ project }) {
  const { id, visual, accent } = project
  if (visual === 'terrain') return <TerrainVisual id={id} accent={accent} />
  if (visual === 'nebula') return <NebulaVisual id={id} accent={accent} />
  if (visual === 'forge') return <ForgeVisual id={id} accent={accent} />
  if (visual === 'ledger') return <LedgerVisual id={id} accent={accent} />
  return <NetworkVisual id={id} accent={accent} />
}
