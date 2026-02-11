'use client';

import { useState } from 'react';
import ModalFooter from '../ModalFooter';
import TeamMemberRow from './TeamMemberRow';
import { useAuthUser } from '@/apiClient';

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
}: TeamRolesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: currentUser, isLoading } = useAuthUser();

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

  const handleSave = async () => {
    // Validate all emails before saving
    const isValid = members.every(m => {
      if (!m.email) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(m.email);
    });

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{...members, agency_id: currentUser?.agency_id || null }]),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send invitation");
        return;
      }

      console.log('Gespeicherte Mitglieder:', members);
      onClose();
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }

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
      <ModalFooter onClose={onClose} onSave={handleSave} loading={isSubmitting} isValid={members.every(m => m.email && m.role)} />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};
