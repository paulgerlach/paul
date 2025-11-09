"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f7f7f7',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>Ein Fehler ist aufgetreten!</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>
        Es tut uns leid, aber etwas ist schief gelaufen.
        <br />
        Bitte versuchen Sie es später noch einmal oder kehren Sie zur vorherigen Seite zurück.
      </p>
      <button
        onClick={() => reset()}
        style={{
          backgroundColor: '#8ad68f',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em',
          marginRight: '10px'
        }}
      >
        Nochmal versuchen
      </button>
      <button
        onClick={() => router.back()}
        style={{
          backgroundColor: '#1e322d',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em'
        }}
      >
        Zurück zur vorherigen Seite
      </button>
    </div>
  );
}
