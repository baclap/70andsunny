export function IconGraphic({ size }: { size: number }) {
  return (
    <div
      style={{
        fontSize: size * 0.8,
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ☀️
    </div>
  );
}
