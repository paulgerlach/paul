export function ErrorState({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center px-4 py-3 rounded-xl bg-red-50 text-red-700 h-full flex items-center justify-center shadow">
        {message}
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center px-4 py-3 rounded-xl bg-white text-[#6B7280] h-full flex items-center justify-center shadow">
        {message}
      </div>
    </div>
  );
}

export function GlobalErrorBanner({ message }: { message: string }) {
  return (
    <div className="w-full">
      <div className="px-4 py-3 rounded-xl bg-red-50 text-red-700 h-full flex items-center justify-center shadow">
        {message}
      </div>
    </div>
  );
}


