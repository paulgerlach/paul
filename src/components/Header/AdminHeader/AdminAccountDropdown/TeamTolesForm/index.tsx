'use client';

import ModalFooter from '../ModalFooter';

export default function TeamRolesForm({ onClose, inputStyle, labelStyle }: { onClose: () => void, inputStyle: string, labelStyle: string }) {
  const selectTriggerStyle = `${inputStyle} flex items-center justify-between text-gray-400 cursor-pointer hover:bg-gray-50`;

  const Row = () => (
    <div className="flex gap-4 w-full">
      <div className="flex-1">
        <label className={labelStyle}>Nutzer</label>
        <div className={selectTriggerStyle}>
          <span></span> {/* Empty state as shown in image */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
      <div className="flex-1">
        <label className={labelStyle}>Rolle</label>
        <div className={selectTriggerStyle}>
          <span></span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 mt-2">
      <Row />
      <Row />
      <Row />
      
      <div className="w-full">
        <label className={labelStyle}>Weitere Nutzer</label>
        <button className="w-full py-3 border-2 border-dashed border-[#D1D5DB] rounded-lg flex items-center justify-start px-4 gap-2 text-[#9CA3AF] hover:bg-gray-50 transition-colors">
          <span className="text-xl font-light">+</span>
          <span className="text-sm">Weiteren Nutzer hinzufügen</span>
        </button>
      </div>
      <ModalFooter onClose={onClose} />
    </div>
  );
};
