'use client'; 

// --- 6. Support ---
// TODO(form): TODO(form): Correct UI needed! + Submission + validation pending.
export default function SupportForm({ onClose, inputStyle, labelStyle }: { onClose: () => void, inputStyle: string, labelStyle: string }) {
  return (
    <div className="flex flex-col gap-5 mt-2">
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Betreff</label>
        <select title='betreff' className={`${inputStyle} appearance-none cursor-pointer`} defaultValue="">
            <option value="" disabled>Wählen Sie ein Thema</option>
            <option value="technical">Technisches Problem</option>
            <option value="billing">Abrechnung</option>
            <option value="feature">Feature Wunsch</option>
          </select>
      </div>
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Nachricht</label>
        <textarea rows={5} className={`${inputStyle} resize-none`} placeholder="Wie können wir Ihnen helfen?" />
      </div>
      <div className="flex justify-end pt-4">
        <button 
          className="w-full px-6 py-2.5 text-sm font-medium text-white bg-[#7AD085] rounded-md hover:bg-[#6bc176] shadow-sm transition-colors"
        >
          Nachricht senden
        </button>
      </div>
    </div>
  );
};
