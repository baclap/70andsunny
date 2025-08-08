import { ImageResponse } from "next/og";

export const size = {
  width: 16,
  height: 16,
};

export const contentType = "image/png";

export default function Icon16() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          fontSize: 12,
        }}
      >
        ☀️
      </div>
    ),
    size
  );
}
