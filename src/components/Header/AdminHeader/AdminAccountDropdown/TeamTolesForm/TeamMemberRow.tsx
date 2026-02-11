'use client'

// --- 3. Team & Rolle Form ---
// TODO(form): UI-only form. Submission + validation pending.
export default function TeamMemberRow({ inputStyle, labelStyle }: { inputStyle: string, labelStyle: string }) {
  const selectTriggerStyle = `${inputStyle} flex items-center justify-between text-gray-400 cursor-pointer hover:bg-gray-50`;
  return (
    <div className="flex gap-4 w-full">
      <div className="flex-1">
        <label className={labelStyle}>Nutzer</label>
        <div className={selectTriggerStyle}>
          <span></span> {/* Empty state as shown in image */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </div>
      </div>
      <div className="flex-1">
        <label className={labelStyle}>Rolle</label>
        <div className={selectTriggerStyle}>
          <span></span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </div>
      </div>
    </div>
  )
}
