import Link from "next/link";

export default function SharedNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Shared Dashboard Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The shared dashboard you're looking for doesn't exist or the link may be invalid.
        </p>
        <Link 
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors inline-block"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

