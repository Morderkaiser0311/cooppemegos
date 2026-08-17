export function Icon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'menu':
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      )
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
      )
    case 'close':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...common}>
          <path d="M4 18V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 3z" />
        </svg>
      )
    case 'credit':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </svg>
      )
    case 'invest':
      return (
        <svg {...common}>
          <path d="M4 18h16M7 14l3-4 3 2 4-6" />
        </svg>
      )
    case 'web':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
        </svg>
      )
    case 'app':
      return (
        <svg {...common}>
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <path d="M11 18h2" />
        </svg>
      )
    case 'wallet':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="12" rx="2" />
          <path d="M16 13h2" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...common}>
          <rect x="7" y="3" width="10" height="18" rx="2" />
        </svg>
      )
    case 'qr':
      return (
        <svg {...common}>
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM16 16h2v2h-2z" />
        </svg>
      )
    case 'monitor':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      )
    case 'card':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 18V8M10 18V4M16 18v-7M20 18H3" />
        </svg>
      )
    case 'hand':
      return (
        <svg {...common}>
          <path d="M8 13V7a1.5 1.5 0 0 1 3 0v5M11 12V6a1.5 1.5 0 0 1 3 0v6M14 12V8a1.5 1.5 0 1 1 3 0v8a4 4 0 0 1-4 4h-3a5 5 0 0 1-5-5v-4a1.5 1.5 0 0 1 3 0v3" />
        </svg>
      )
    case 'piggy':
      return (
        <svg {...common}>
          <path d="M5 12c0-3 3-6 8-6 4 0 7 2 8 5h2v4h-2a6 6 0 0 1-6 4H11a6 6 0 0 1-6-7z" />
          <path d="M8 10h.01" />
        </svg>
      )
    case 'swap':
      return (
        <svg {...common}>
          <path d="M7 7h11l-3-3M17 17H6l3 3" />
        </svg>
      )
    case 'building':
      return (
        <svg {...common}>
          <path d="M4 20V6l8-3 8 3v14M4 20h16M9 20v-5h6v5" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
}
