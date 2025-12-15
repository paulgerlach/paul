import React from 'react';
import { MessageCircle, Sparkles } from "lucide-react";

export default function ChatBot() {
  return (
    <div className='bg-green cursor-pointer hover:scale-105 transition ease-in-out rounded-full shadow-md p-3'>
      <MessageCircle className="w-12 h-12" color='#FFFFFF'/>
    </div>
  );
}
