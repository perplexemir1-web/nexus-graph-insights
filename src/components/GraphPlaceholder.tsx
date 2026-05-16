export function GraphPlaceholder() {
  return (
    <div id="graph-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <svg viewBox="0 0 900 600" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="warmArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(244,167,66,0.7)" />
          </marker>
        </defs>

        {/* Background noise edges */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.5">
          <line x1="600" y1="450" x2="780" y2="500" />
          <line x1="780" y1="500" x2="700" y2="360" />
          <line x1="220" y1="450" x2="340" y2="520" />
          <line x1="340" y1="520" x2="500" y2="490" />
          <line x1="60" y1="350" x2="180" y2="400" />
          <line x1="800" y1="220" x2="700" y2="140" />
        </g>

        {/* Dim edges from user to others */}
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
          <line x1="450" y1="300" x2="680" y2="140" />
          <line x1="450" y1="300" x2="700" y2="360" />
          <line x1="450" y1="300" x2="220" y2="450" />
          <line x1="450" y1="300" x2="600" y2="450" />
          <line x1="450" y1="300" x2="180" y2="400" />
          <line x1="450" y1="300" x2="780" y2="500" />
        </g>

        {/* Warm path */}
        <g stroke="rgba(244,167,66,0.55)" strokeWidth="2.5" fill="none" markerEnd="url(#warmArrow)">
          <line x1="450" y1="300" x2="280" y2="175" />
          <line x1="280" y1="175" x2="145" y2="95" />
          <line x1="145" y1="95" x2="90" y2="60" />
        </g>

        {/* Background person nodes */}
        {[
          [600, 450, 8], [780, 500, 7], [220, 450, 9], [340, 520, 8],
          [60, 350, 7], [180, 400, 10], [800, 220, 8], [560, 230, 7],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r}
            fill="rgba(83,74,183,0.20)" stroke="rgba(127,119,221,0.35)" strokeWidth="0.5" />
        ))}

        {/* Companies */}
        <g>
          <circle cx="90" cy="60" r="16" fill="rgba(29,158,117,0.22)" stroke="#1D9E75" strokeWidth="1.5" />
          <text x="90" y="92" fontSize="9" fill="rgba(93,202,165,0.80)" textAnchor="middle" fontFamily="Inter">Google</text>

          <circle cx="680" cy="140" r="14" fill="rgba(29,158,117,0.15)" stroke="#0F6E56" strokeWidth="1" />
          <text x="680" y="168" fontSize="9" fill="rgba(93,202,165,0.55)" textAnchor="middle" fontFamily="Inter">Stripe</text>

          <circle cx="700" cy="360" r="13" fill="rgba(29,158,117,0.12)" stroke="#0F6E56" strokeWidth="1" />
          <text x="700" y="387" fontSize="9" fill="rgba(93,202,165,0.50)" textAnchor="middle" fontFamily="Inter">Grab</text>
        </g>

        {/* People on warm path */}
        <g>
          <circle cx="280" cy="175" r="18" fill="rgba(55,138,221,0.25)" stroke="#378ADD" strokeWidth="2" />
          <text x="280" y="176" fontSize="9" fill="rgba(133,183,235,0.9)" textAnchor="middle" fontFamily="Inter">James T.</text>
          <text x="280" y="187" fontSize="8" fill="rgba(133,183,235,0.5)" textAnchor="middle" fontFamily="Inter">UM alum</text>
          <rect x="265" y="148" width="22" height="11" rx="5" fill="rgba(244,167,66,0.15)" />
          <text x="276" y="156" fontSize="8" fill="#F4A742" textAnchor="middle" fontFamily="Inter" fontWeight="600">82</text>

          <circle cx="145" cy="95" r="18" fill="rgba(55,138,221,0.28)" stroke="#378ADD" strokeWidth="1.5" />
          <text x="145" y="96" fontSize="9" fill="rgba(133,183,235,0.9)" textAnchor="middle" fontFamily="Inter">Priya S.</text>
          <text x="145" y="107" fontSize="8" fill="rgba(133,183,235,0.5)" textAnchor="middle" fontFamily="Inter">Google SWE</text>
          <rect x="130" y="68" width="22" height="11" rx="5" fill="rgba(244,167,66,0.15)" />
          <text x="141" y="76" fontSize="8" fill="#F4A742" textAnchor="middle" fontFamily="Inter" fontWeight="600">78</text>
        </g>

        {/* User node */}
        <g>
          <circle cx="450" cy="300" r="22" fill="rgba(244,167,66,0.18)" stroke="#F4A742" strokeWidth="2" />
          <text x="450" y="300" fontSize="11" fontWeight="600" fill="#F4A742" textAnchor="middle" fontFamily="Inter">You</text>
          <text x="450" y="312" fontSize="8" fill="rgba(244,167,66,0.55)" textAnchor="middle" fontFamily="Inter">Ahmad K.</text>
        </g>
      </svg>
    </div>
  );
}
