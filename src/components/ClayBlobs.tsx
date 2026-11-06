import React from "react";

type ClayBlobsProps = {
  colors?: [string, string, string];
};

/** Two very soft, slowly morphing corner blobs (single color) for a subtle glow. */
export default function ClayBlobs({
  colors = ["bg-violet-300", "bg-pink-300", "bg-sky-300"],
}: ClayBlobsProps) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none print:hidden">
      <div className={`absolute -top-40 -left-40 w-[24rem] h-[24rem] ${colors[0]} opacity-10 blur-3xl animate-blob`} />
      <div
        className={`absolute -bottom-40 -right-40 w-[24rem] h-[24rem] ${colors[0]} opacity-10 blur-3xl animate-blob`}
        style={{ animationDelay: "-8s" }}
      />
    </div>
  );
}
