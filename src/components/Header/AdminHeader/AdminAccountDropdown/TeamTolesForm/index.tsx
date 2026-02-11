'use client';

import { useState } from 'react';
import ModalFooter from '../ModalFooter';
import TeamMemberRow from './TeamMemberRow';

export interface TeamMember {
  id: string;
  email: string;
  role: string;
}

export interface Role {
  value: string;
  label: string;
}

interface TeamRolesFormProps {
  onClose: () => void;
  inputStyle: string;
  labelStyle: string;
  roles?: Role[];
  initialMembers?: TeamMember[];
  onSave?: (members: TeamMember[]) => void;
}

const defaultRoles: Role[] = [
  { value: 'super_admin', label: 'Super-Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'Standardbenutzer' },
];

export default function TeamRolesForm({ 
  onClose, 
  inputStyle, 
  labelStyle, 
  roles = defaultRoles,
  initialMembers = [],
  onSave 
}: TeamRolesFormProps) {
  const [members, setMembers] = useState<TeamMember[]>(
    initialMembers.length > 0 
      ? initialMembers 
      : [{ id: crypto.randomUUID(), email: '', role: '' }]
  );

  const addMember = () => {
    setMembers([...members, { id: crypto.randomUUID(), email: '', role: '' }]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleSave = () => {
    // Validate all emails before saving
    const isValid = members.every(m => {
      if (!m.email) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(m.email);
    });

    if (!isValid) {
      alert('Bitte füllen Sie alle E-Mail-Felder korrekt aus.');
      return;
    }

    if (onSave) {
      onSave(members);
    }
    onClose();
  };

  return (
    <div className="flex flex-col gap-5 mt-2">
      {members.map((member, index) => (
        <TeamMemberRow
          key={member.id}
          member={member}
          index={index}
          inputStyle={inputStyle}
          labelStyle={labelStyle}
          roles={roles}
          onUpdate={(field, value) => updateMember(member.id, field, value)}
          onRemove={() => removeMember(member.id)}
          canRemove={members.length > 1}
        />
      ))}
      
      <div className="w-full">
        <button 
          onClick={addMember}
          className="w-full py-3 border-2 border-dashed border-[#D1D5DB] rounded-lg flex items-center justify-start px-4 gap-2 text-[#9CA3AF] hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl font-light">+</span>
          <span className="text-sm">Weiteren Nutzer hinzufügen</span>
        </button>
      </div>
      <ModalFooter onClose={onClose} onSave={handleSave} />
    </div>
  );
};
