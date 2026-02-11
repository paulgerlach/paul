'use client';

export default function ModalFooter({ onClose, loading, onSave }: { onClose: () => void, loading?: boolean, onSave?: () => void   }) {
  return (
    <div className="flex justify-between items-center pt-6 mt-2">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
      >
        Abbrechen
      </button>

      {onSave &&
      <button
        type="button"
        onClick={onSave}
        disabled={loading}
        className="px-6 py-2.5 text-sm font-medium text-white bg-[#7AD085] rounded-md hover:bg-[#6bc176] shadow-sm transition-colors disabled:opacity-50"
      >
        {loading ? "Lädt..." : "Speichern"}
      </button>
      }
    </div>
  );
}
