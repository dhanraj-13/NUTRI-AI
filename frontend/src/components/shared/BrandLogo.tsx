interface BrandLogoProps {
  collapsed?: boolean;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

const sizes = {
  sm: { box: "w-8 h-8", text: "text-sm", tag: "text-[10px]" },
  md: { box: "w-10 h-10", text: "text-lg", tag: "text-xs" },
  lg: { box: "w-14 h-14", text: "text-2xl", tag: "text-sm" },
};

export function BrandLogo({ collapsed = false, size = "md", showTagline = false }: BrandLogoProps) {
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`${s.box} rounded-2xl overflow-hidden flex-shrink-0`}
        style={{
          background: "linear-gradient(135deg,rgba(24,184,154,0.18),rgba(143,208,129,0.12))",
          border: "1px solid rgba(24,184,154,0.18)",
          boxShadow: "0 0 18px rgba(24,184,154,0.22)",
        }}
      >
        <img
          src="/nutri-ai-logo.png"
          alt="NUTRI AI logo"
          className="w-full h-full object-cover"
        />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <span className={`font-display font-bold ${s.text} leading-none whitespace-nowrap`} style={{ color: "#E8F2ED" }}>
            NUTRI AI
          </span>
          {showTagline && (
            <p className={`${s.tag} mt-1 tracking-[0.24em] uppercase whitespace-nowrap`} style={{ color: "#9AB8A8" }}>
              Nutrition · Diet · Hydration
            </p>
          )}
        </div>
      )}
    </div>
  );
}
