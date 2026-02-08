"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("[Admin Error Boundary]", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f7f7f7",
        color: "#333",
      }}
    >
      <h1 style={{ fontSize: "2.5em", marginBottom: "20px" }}>
        Ein Fehler ist aufgetreten
      </h1>
      <p
        style={{
          fontSize: "1.1em",
          marginBottom: "30px",
          maxWidth: "500px",
          lineHeight: "1.6",
        }}
      >
        Im Admin-Bereich ist ein unerwarteter Fehler aufgetreten.
        <br />
        Bitte versuchen Sie es erneut oder kehren Sie zur Startseite zurück.
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => reset()}
          style={{
            backgroundColor: "#8ad68f",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1em",
          }}
        >
          Nochmal versuchen
        </button>
        <button
          onClick={() => router.push("/admin")}
          style={{
            backgroundColor: "#1e322d",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1em",
          }}
        >
          Zur Admin-Startseite
        </button>
      </div>
    </div>
  );
}
