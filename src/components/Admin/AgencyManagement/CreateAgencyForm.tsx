'use client';

import React from 'react';

interface CreateAgencyFormProps {
  onCreate: (name: string) => Promise<void>;
}


export default function CreateAgencyForm({onCreate}:CreateAgencyFormProps) {
  return (
    <div>CreateAgencyForm</div>
  )
}
