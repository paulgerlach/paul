import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="de">
      <body>
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
          <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>Seite nicht gefunden</h1>
          <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>
            Entschuldigung, die von Ihnen gesuchte Seite existiert nicht.
          </p>
          <Link href="/">
            <button
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
              Zur Startseite
            </button>
          </Link>
        </div>
      </body>
    </html>
  );
}
