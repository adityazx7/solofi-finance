import fs from 'fs';
import path from 'path';

const targetDir = path.resolve(process.cwd(), 'assets/animations');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Helper to create basic Lottie JSON structure
function createLottieJson(name, width, height) {
  return {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: 120,
    w: width,
    h: height,
    nm: name,
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: `${name} Shape Layer`,
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [width / 2, height / 2, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ t: 0, s: [0, 0, 100] }, { t: 30, s: [100, 100, 100] }] }
        },
        ao: 0,
        shapes: [
          {
            ty: 'el',
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [width * 0.6, height * 0.6] }
          },
          {
            ty: 'fl',
            c: { a: 0, k: [0.06, 0.72, 0.51, 1] },
            o: { a: 0, k: 100 }
          }
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0
      }
    ]
  };
}

const ANIMATIONS = {
  'payment-success-checkmark': {
    svg: `
      <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes stroke { 100% { stroke-dashoffset: 0; } }
          @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } }
          @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 60px #10B981; } }
          .circle { stroke-dasharray: 280; stroke-dashoffset: 280; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
          .check { transform-origin: 50% 50%; stroke-dasharray: 60; stroke-dashoffset: 60; animation: stroke 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards; }
        </style>
        <circle cx="100" cy="100" r="44" fill="#10B981" fill-opacity="0.15" />
        <circle class="circle" cx="100" cy="100" r="44" fill="none" stroke="#10B981" stroke-width="6" />
        <path class="check" d="M 80 100 L 94 114 L 126 82" fill="none" stroke="#10B981" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `
  },

  'lock-closing-animation': {
    svg: `
      <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes lockShackle {
            0% { transform: translateY(-16px); }
            50%, 100% { transform: translateY(0); }
          }
          .shackle { animation: lockShackle 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate; }
        </style>
        <path class="shackle" d="M 75 90 L 75 60 C 75 46 86 35 100 35 C 114 35 125 46 125 60 L 125 90" fill="none" stroke="#94A3B8" stroke-width="12" stroke-linecap="round" />
        <rect x="60" y="80" width="80" height="74" rx="16" fill="#F59E0B" />
        <circle cx="100" cy="112" r="8" fill="#451A03" />
        <path d="M 97 115 L 103 115 L 105 130 L 95 130 Z" fill="#451A03" />
      </svg>
    `
  },

  'money-transfer-animation': {
    svg: `
      <svg viewBox="0 0 280 120" width="280" height="120" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes coinFly {
            0% { transform: translateX(0) scale(0.8); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateX(140px) scale(1); opacity: 0; }
          }
          .coin-moving { animation: coinFly 1.6s ease-in-out infinite; }
        </style>
        <!-- Source Checking -->
        <rect x="20" y="30" width="60" height="60" rx="14" fill="#0F172A" stroke="#1E293B" stroke-width="2" />
        <text x="50" y="65" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FFFFFF">ACH</text>

        <!-- Moving Coin -->
        <g class="coin-moving">
          <circle cx="70" cy="60" r="14" fill="#F59E0B" stroke="#D97706" stroke-width="2" />
          <text x="70" y="65" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="13" fill="#78350F">$</text>
        </g>

        <!-- Dotted Path -->
        <line x1="90" y1="60" x2="190" y2="60" stroke="#10B981" stroke-width="2" stroke-dasharray="4 4" />

        <!-- Target Vault -->
        <rect x="200" y="30" width="60" height="60" rx="14" fill="#10B981" />
        <text x="230" y="65" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="10" fill="#FFFFFF">VAULT</text>
      </svg>
    `
  },

  'confetti': {
    svg: `
      <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes fall1 { 0% { transform: translateY(-20px) rotate(0deg); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(180px) rotate(360deg); opacity: 0; } }
          .c1 { animation: fall1 2s linear infinite; }
          .c2 { animation: fall1 2.3s linear 0.4s infinite; }
          .c3 { animation: fall1 1.8s linear 0.8s infinite; }
        </style>
        <rect class="c1" x="40" y="10" width="8" height="14" rx="2" fill="#10B981" />
        <circle class="c2" cx="80" cy="20" r="5" fill="#F59E0B" />
        <rect class="c3" x="120" y="15" width="10" height="10" rx="2" fill="#3B82F6" />
        <polygon class="c1" points="160,10 168,24 152,24" fill="#EC4899" />
        <rect class="c2" x="60" y="5" width="7" height="12" rx="2" fill="#8B5CF6" />
        <circle class="c3" cx="140" cy="5" r="4" fill="#10B981" />
      </svg>
    `
  },

  'coin-drop': {
    svg: `
      <svg viewBox="0 0 160 200" width="160" height="200" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes dropCoin {
            0% { transform: translateY(-40px); opacity: 0; }
            30% { opacity: 1; }
            70% { transform: translateY(110px); }
            80% { transform: translateY(100px); }
            100% { transform: translateY(110px); opacity: 1; }
          }
          .drop { animation: dropCoin 1.5s cubic-bezier(0.25, 1, 0.5, 1) infinite; }
        </style>
        <!-- Vault Slot -->
        <rect x="40" y="140" width="80" height="12" rx="6" fill="#1E293B" stroke="#10B981" stroke-width="2" />
        <g class="drop">
          <circle cx="80" cy="20" r="22" fill="#FBBF24" stroke="#D97706" stroke-width="3" />
          <text x="80" y="27" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="20" fill="#78350F">$</text>
        </g>
      </svg>
    `
  },

  'shield-secure-animation': {
    svg: `
      <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes shieldPulse {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px #10B981); }
            50% { transform: scale(1.06); filter: drop-shadow(0 0 14px #10B981); }
          }
          .pulse { transform-origin: 100px 100px; animation: shieldPulse 2s ease-in-out infinite; }
        </style>
        <g class="pulse">
          <path d="M 100 35 L 145 55 C 145 110 100 155 100 155 C 100 155 55 110 55 55 Z" fill="#0F172A" stroke="#10B981" stroke-width="4" />
          <path d="M 85 95 L 95 105 L 118 80" fill="none" stroke="#10B981" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </svg>
    `
  },

  'loading-skeleton': {
    svg: `
      <svg viewBox="0 0 300 120" width="300" height="120" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .shimmer-band { animation: shimmer 1.5s infinite; }
        </style>
        <defs>
          <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1E293B" stop-opacity="0" />
            <stop offset="50%" stop-color="#334155" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#1E293B" stop-opacity="0" />
          </linearGradient>
        </defs>
        <!-- Skeleton Cards -->
        <rect x="15" y="20" width="80" height="80" rx="12" fill="#1E293B" />
        <rect x="110" y="25" width="160" height="18" rx="6" fill="#1E293B" />
        <rect x="110" y="55" width="110" height="14" rx="5" fill="#1E293B" />
        <rect x="110" y="80" width="70" height="14" rx="5" fill="#1E293B" />
        <!-- Overlay Shimmer -->
        <rect class="shimmer-band" x="0" y="0" width="300" height="120" fill="url(#shimmerGrad)" />
      </svg>
    `
  },

  'number-counter': {
    svg: `
      <svg viewBox="0 0 240 100" width="240" height="100" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes countPop {
            0% { transform: scale(0.95); }
            50% { transform: scale(1.05); }
            100% { transform: scale(0.95); }
          }
          .counter-txt { transform-origin: 120px 55px; animation: countPop 2s ease-in-out infinite; }
        </style>
        <rect width="240" height="100" rx="16" fill="#0F172A" stroke="#10B981" stroke-width="2" />
        <text class="counter-txt" x="120" y="62" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="34" fill="#10B981">$10,030</text>
      </svg>
    `
  }
};

async function run() {
  console.log(`Generating ${Object.keys(ANIMATIONS).length} animations (Lottie JSON + Animated SVG)...`);

  for (const [key, data] of Object.entries(ANIMATIONS)) {
    const cleanSvg = data.svg.trim();
    // Save SVG
    fs.writeFileSync(path.join(targetDir, `${key}.svg`), cleanSvg, 'utf-8');

    // Create Lottie-ready JSON definition
    const lottieJson = createLottieJson(key, 200, 200);
    fs.writeFileSync(path.join(targetDir, `${key}.json`), JSON.stringify(lottieJson, null, 2), 'utf-8');

    console.log(`  ✓ Created ${key}.svg & ${key}.json`);
  }

  console.log('Finished animations generation.');
}

run().catch(console.error);
