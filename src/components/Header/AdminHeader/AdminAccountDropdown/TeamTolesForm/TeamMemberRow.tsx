'use client'

// --- 3. Team & Rolle Form ---
// TODO(form): UI-only form. Submission + validation pending.
export default function TeamMemberRow({ inputStyle, labelStyle }: { inputStyle: string, labelStyle: string }) {
  return (
    <div className="flex gap-4 w-full">
      <div className="flex-1 space-y-1">
        <label className={labelStyle}>Nutzer</label>
        <button className={inputStyle}>
          <span className="text-transparent">Placeholder</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
      <div className="flex-1 space-y-1">
        <label className={labelStyle}>Rolle</label>
        <button className={inputStyle}>
          <span className="text-transparent">Placeholder</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  )
}
