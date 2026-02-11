'use client';

import ModalFooter from '../ModalFooter';
import TeamMemberRow from './TeamMemberRow';

export default function TeamRolesForm({ onClose, inputStyle, labelStyle }: { onClose: () => void, inputStyle: string, labelStyle: string }) {

  return (
    <div className="flex flex-col gap-5 mt-2">
      <TeamMemberRow inputStyle={inputStyle} labelStyle={labelStyle} />
      
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
