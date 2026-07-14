import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export async function renderOgImage() {
  const [bogle, inter] = await Promise.all([
    readFile( join( process.cwd(), "public/fonts/BBHBogle-Regular.ttf" ) ),
    readFile( join( process.cwd(), "public/fonts/InterVariable.ttf" ) ),
  ] );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <div style={{ display: "flex", fontFamily: "BBH Bogle", fontWeight: 100, fontSize: 140, color: "#343434" }}>
          Hoop State
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Inter Variable",
            fontWeight: 400,
            fontSize: 56,
            color: "#4e7fbf",
            textTransform: "uppercase",
            marginTop: -18,
          }}
        >
          Gameflows
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        { name: "BBH Bogle", data: bogle, weight: 100, style: "normal" },
        { name: "Inter Variable", data: inter, weight: 400, style: "normal" },
      ],
    },
  );
}
