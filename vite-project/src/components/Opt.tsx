import React, { useState } from 'react';
import { Map } from 'lucide-react';

export default function OtpRow() {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div>
        <div>
        <Map/>
        </div>
    </div>


    // <div 
    //   className={`min-w-[120px] h-[55px] rounded-lg border bg-card text-card-foreground shadow-sm p-1 items-center ${isSelected ? 'bg-blue-500' : ''}`}
    //   onClick={() => setIsSelected(!isSelected)}
    // >


    // </div>

    
  );
}