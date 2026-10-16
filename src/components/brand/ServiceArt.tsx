export type Service = 'food' | 'parcel' | 'grocery' | 'books' | 'gift' | 'pet' | 'pharmacy' | 'more';

/** Flat, consistent-weight service illustrations drawn for Addis Gebeta. */
export function ServiceArt({ kind, size = 56 }: { kind: Service; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      {ART[kind]}
    </svg>
  );
}

const ART: Record<Service, JSX.Element> = {
  food: (
    <g>
      <ellipse cx="32" cy="57" rx="21" ry="3" fill="#000" opacity=".08" />
      <path d="M10 30C10 15 54 15 54 30Z" fill="#F4A63A" />
      <path d="M17 22c3-4 9-6 13-6" stroke="#FAD08A" strokeWidth="3" strokeLinecap="round" fill="none" />
      {[
        [24, 22],
        [31, 19.5],
        [38, 21],
        [44, 25],
        [29, 25.5],
        [36, 26],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.7" ry="1" fill="#FFF3D6" transform={`rotate(-20 ${x} ${y})`} />
      ))}
      <path d="M8 31q4 4 8 0t8 0 8 0 8 0 8 0 8 0v4H8Z" fill="#6CC24A" />
      <path d="M10 35h44l-7 6-6-5-6 5-6-5-6 5-6-5z" fill="#FFD234" />
      <rect x="9" y="37" width="46" height="8" rx="4" fill="#7B3F1E" />
      <path d="M10 46h44c0 5-4 8-9 8H19c-5 0-9-3-9-8Z" fill="#E8913A" />
    </g>
  ),
  parcel: (
    <g>
      <ellipse cx="32" cy="58" rx="20" ry="3" fill="#000" opacity=".08" />
      <path d="M32 9l22 11-22 11-22-11z" fill="#EDBE80" />
      <path d="M10 20l22 11v25L10 45z" fill="#D69C5C" />
      <path d="M54 20L32 31v25l22-11z" fill="#BF8243" />
      <path d="M21 14.5l22 11v9" stroke="#F7E6C6" strokeWidth="5" fill="none" strokeLinejoin="round" />
      <path d="M14 38l7 3.5" stroke="#F2D9AE" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
  grocery: (
    <g>
      <ellipse cx="32" cy="58" rx="18" ry="3" fill="#000" opacity=".08" />
      <circle cx="24" cy="22" r="7" fill="#EF4B3F" />
      <path d="M24 15c1-3 4-4 6-3" stroke="#3E9E4A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M37 27l7-19 3 1-5 19z" fill="#F7882F" />
      <path d="M44 8c-2-3 0-5 2-5M46 9c1-3 4-3 5-2" stroke="#3E9E4A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M30 26c-2-8 2-13 6-14 1 5-1 10-6 14z" fill="#5DBB4A" />
      <path d="M24 27c0-9 16-9 16 0" stroke="#3F8F4A" strokeWidth="3" fill="none" />
      <path d="M14 27h36l-3 29H17z" fill="#6BBF73" />
      <path d="M14 27h36l-.5 5h-35z" fill="#86D18D" />
    </g>
  ),
  books: (
    <g>
      <ellipse cx="32" cy="58" rx="22" ry="3" fill="#000" opacity=".08" />
      <rect x="9" y="44" width="46" height="11" rx="2.5" fill="#4C7BE8" />
      <rect x="45" y="46.5" width="8" height="6" rx="1" fill="#EAF0FF" />
      <rect x="13" y="33" width="40" height="11" rx="2.5" fill="#EC6A8A" />
      <rect x="15" y="35.5" width="7" height="6" rx="1" fill="#FFE3EA" />
      <rect x="8" y="22" width="43" height="11" rx="2.5" fill="#F5C044" />
      <rect x="42" y="24.5" width="7" height="6" rx="1" fill="#FFF4D2" />
      <rect x="14" y="11" width="36" height="11" rx="2.5" fill="#33B3A4" />
      <rect x="16" y="13.5" width="6" height="6" rx="1" fill="#D9F6F2" />
    </g>
  ),
  gift: (
    <g>
      <ellipse cx="32" cy="58" rx="19" ry="3" fill="#000" opacity=".08" />
      <path d="M31 22c-6-9-15-6-12 0 2 3 8 2 12 0zM33 22c6-9 15-6 12 0-2 3-8 2-12 0z" fill="#FFC21A" />
      <rect x="12" y="30" width="40" height="25" rx="3" fill="#EF5A6F" />
      <rect x="9" y="22" width="46" height="10" rx="3" fill="#F57F90" />
      <rect x="29" y="22" width="6" height="33" fill="#FFD24D" />
    </g>
  ),
  pet: (
    <g>
      <ellipse cx="32" cy="42" rx="12" ry="10" fill="#9A6A45" />
      <ellipse cx="17" cy="29" rx="5" ry="6" fill="#9A6A45" transform="rotate(-20 17 29)" />
      <ellipse cx="26" cy="19" rx="5" ry="6.5" fill="#9A6A45" transform="rotate(-6 26 19)" />
      <ellipse cx="38" cy="19" rx="5" ry="6.5" fill="#9A6A45" transform="rotate(6 38 19)" />
      <ellipse cx="47" cy="29" rx="5" ry="6" fill="#9A6A45" transform="rotate(20 47 29)" />
      <ellipse cx="29" cy="38" rx="3" ry="2" fill="#B98A62" />
    </g>
  ),
  pharmacy: (
    <g>
      <rect x="10" y="10" width="44" height="44" rx="12" fill="#2F9E6E" />
      <path d="M32 19v26M19 32h26" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
    </g>
  ),
  more: (
    <g>
      <circle cx="18" cy="32" r="6" fill="#5B5F6B" />
      <circle cx="32" cy="32" r="6" fill="#5B5F6B" />
      <circle cx="46" cy="32" r="6" fill="var(--brand)" />
    </g>
  ),
};
