const nodes = [
  [218, 246], [337, 209], [406, 277], [288, 296], [352, 352], [210, 385], [425, 393], [300, 445],
] as const;

export default function StoryLens() {
  return (
    <div className="story-lens" data-story-lens="">
      <div className="story-lens__halo" />
      <svg className="story-lens__bezel" viewBox="0 0 640 640" fill="none">
        <defs>
          <linearGradient id="story-lens-metal" x1="161" y1="90" x2="531" y2="567" gradientUnits="userSpaceOnUse">
            <stop stopColor="#424b59" />
            <stop offset=".19" stopColor="#d5e6ff" />
            <stop offset=".35" stopColor="#4f6e8d" />
            <stop offset=".52" stopColor="#0a101e" />
            <stop offset=".8" stopColor="#7887a8" />
            <stop offset="1" stopColor="#1b2437" />
          </linearGradient>
          <radialGradient id="story-lens-depth" cx=".36" cy=".28" r=".68">
            <stop stopColor="#6883a3" />
            <stop offset=".36" stopColor="#263853" />
            <stop offset=".72" stopColor="#111a2d" />
            <stop offset="1" stopColor="#070d19" />
          </radialGradient>
          <linearGradient id="story-lens-edge" x1="98" y1="129" x2="528" y2="523" gradientUnits="userSpaceOnUse">
            <stop stopColor="#eef7ff" stopOpacity=".92" />
            <stop offset=".45" stopColor="#78a9d8" stopOpacity=".36" />
            <stop offset=".65" stopColor="#263344" stopOpacity=".2" />
            <stop offset="1" stopColor="#9ebbe6" stopOpacity=".45" />
          </linearGradient>
        </defs>
        <circle cx="320" cy="320" r="285" stroke="#8aa9cf" strokeOpacity=".18" strokeDasharray="1 10" strokeWidth="2" />
        <circle cx="320" cy="320" r="270" fill="url(#story-lens-depth)" stroke="url(#story-lens-edge)" strokeWidth="2" />
        <circle cx="320" cy="320" r="254" stroke="url(#story-lens-metal)" strokeWidth="24" />
        <circle cx="320" cy="320" r="263" stroke="#e0ecfb" strokeOpacity=".42" strokeWidth="1.5" />
        <circle cx="320" cy="320" r="242" stroke="#030611" strokeOpacity=".87" strokeWidth="5" />
        <circle cx="320" cy="320" r="231" stroke="#b2c3e2" strokeOpacity=".39" strokeDasharray="1 5" strokeWidth="7" />
        <circle cx="320" cy="320" r="217" stroke="url(#story-lens-edge)" strokeWidth="2" />
        <circle cx="320" cy="320" r="205" fill="#07101e" stroke="#b9d5f7" strokeOpacity=".24" strokeWidth="8" />
        <path d="M112 185a248 248 0 0 1 245-112M441 536a248 248 0 0 0 121-167" stroke="#edf5ff" strokeOpacity=".82" strokeWidth="2" strokeLinecap="round" />
        <path d="M65 320h22m466 0h22M320 65v22m0 466v22" stroke="#dee8ff" strokeOpacity=".56" strokeWidth="1.5" />
      </svg>

      <div className="story-lens__glass">
        <div className="story-lens__material story-lens__material--violet" data-story-material="violet" />
        <div className="story-lens__material story-lens__material--teal" data-story-material="teal" />
        <div className="story-lens__material story-lens__material--amber" data-story-material="amber" />
      </div>

      <svg className="story-lens__globe" viewBox="0 0 640 640" fill="none" data-story-globe="">
        <defs>
          <radialGradient id="story-lens-core">
            <stop stopColor="#e1f8ff" stopOpacity=".72" />
            <stop offset=".2" stopColor="#93d7fe" stopOpacity=".29" />
            <stop offset="1" stopColor="#7bc8ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="320" cy="320" r="104" fill="url(#story-lens-core)" />
        <g stroke="#a7d8fd" strokeOpacity=".39" strokeWidth="1.3">
          <circle cx="320" cy="320" r="161" />
          <ellipse cx="320" cy="320" rx="110" ry="161" />
          <ellipse cx="320" cy="320" rx="55" ry="161" />
          <ellipse cx="320" cy="320" rx="161" ry="64" />
          <path d="M160 320h320m-160-161v322M185 233c70 49 200 49 270 0M185 407c70-49 200-49 270 0" />
        </g>
        <path d="m218 246 119-37 69 68-118 19 64 56 73 41-125 52-90-60 78-89-70-50m119-37 15 143-142 33" stroke="#bfeaff" strokeOpacity=".61" strokeWidth="1.5" strokeLinejoin="round" />
        {nodes.map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="7" fill="#81cffa" fillOpacity=".27" />
            <circle cx={x} cy={y} r="2.4" fill="#e7f7ff" />
          </g>
        ))}
        <circle cx="320" cy="320" r="19" stroke="#d7efff" strokeOpacity=".69" />
        <path d="M308 320h24m-12-12v24" stroke="#e8f7ff" strokeOpacity=".91" />
      </svg>

      <svg className="story-lens__reflections" viewBox="0 0 640 640" fill="none">
        <defs>
          <linearGradient id="story-lens-sheen" x1="183" y1="143" x2="420" y2="445" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e8f3ff" stopOpacity=".58" />
            <stop offset=".45" stopColor="#c4dbfa" stopOpacity=".12" />
            <stop offset="1" stopColor="#a1d4ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M137 270a189 189 0 0 1 326-75c-68-70-228-45-281 58-17 31-26 33-45 17Z" fill="url(#story-lens-sheen)" />
        <path d="M202 471a191 191 0 0 0 261-23" stroke="#b9e3ff" strokeOpacity=".67" strokeWidth="2" strokeLinecap="round" />
        <circle cx="320" cy="320" r="190" stroke="url(#story-lens-edge)" strokeWidth="2" />
      </svg>
    </div>
  );
}
