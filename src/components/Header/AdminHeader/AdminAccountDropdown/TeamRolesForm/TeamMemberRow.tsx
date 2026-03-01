'use client';

import { useState } from 'react';
import { TeamMember, Role } from './index';

interface TeamMemberRowProps {
  member: TeamMember;
  index: number;
  inputStyle: string;
  labelStyle: string;
  roles: Role[];
  onUpdate: (field: keyof TeamMember, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export default function TeamMemberRow({ 
  member, 
  index, 
  inputStyle, 
  labelStyle, 
  roles,
  onUpdate, 
  onRemove,
  canRemove 
}: TeamMemberRowProps) {
  const [emailError, setEmailError] = useState<string>('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (value: string) => {
    onUpdate('email', value);
    validateEmail(value);
  };

  const handleRoleChange = (value: string) => {
    onUpdate('role', value);
  };

  return (
    <div className="flex gap-4 w-full items-start">
      <div className="flex-1">
        <label className={labelStyle}>
          {index === 0 ? 'Nutzer' : ''}
        </label>
        <input
          type="email"
          value={member.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="E-Mail-Adresse"
          className={`${inputStyle} ${emailError ? 'border-red-500' : ''}`}
        />
        {emailError && (
          <span className="text-red-500 text-xs mt-1">{emailError}</span>
        )}
      </div>
      <div className="flex-1">
        <label className={labelStyle}>
          {index === 0 ? 'Rolle' : ''}
        </label>
        <select
          value={member.role}
          onChange={(e) => handleRoleChange(e.target.value)}
          aria-label="Rolle auswählen"
          className={`${inputStyle} text-gray-700 bg-white`}
        >
          <option value="">Rolle auswählen</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
      {canRemove && (
        <button
          onClick={onRemove}
          className="mt-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Nutzer entfernen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  );
}
