export function BindingRings() {
  const rings = [0.18, 0.5, 0.82]; // vertical positions as fractions

  return (
    <div
      className="absolute inset-y-0 pointer-events-none z-20"
      style={{ left: "calc(50% - 18px)", width: 36 }}
    >
      {rings.map((pos, i) => (
        <div
          key={i}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: `calc(${pos * 100}% - 14px)` }}
        >
          {/* Outer ring */}
          <div
            className="w-7 h-7 rounded-full border-[3px] relative"
            style={{
              borderColor: "#9a9590",
              background:
                "radial-gradient(circle at 35% 35%, #e8e4de, #9a9590 60%, #6b6560)",
              boxShadow:
                "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
            }}
          >
            {/* Inner hole */}
            <div
              className="absolute inset-[5px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 40% 35%, #4a4642, #1e1c1a)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6)",
              }}
            />
          </div>
        </div>
      ))}

      {/* Spine shadow strip */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0.06))",
        }}
      />
    </div>
  );
}
