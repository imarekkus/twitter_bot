import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  name: string;
  label: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  name,
  label,
  checked,
  onToggle,
  disabled = false
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    
    const newState = !isChecked;
    setIsChecked(newState);
    onToggle(newState);
  };

  return (
    <div className="flex justify-between items-center">
      <label htmlFor={name} className="font-medium">{label}</label>
      <div className="relative inline-block w-12 align-middle select-none">
        <input 
          type="checkbox" 
          name={name} 
          id={name} 
          checked={isChecked} 
          onChange={handleToggle}
          disabled={disabled}
          className={cn(
            "absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ease-in-out",
            isChecked ? "right-0 border-bonkYellow" : "border-gray-300", 
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
        />
        <label 
          htmlFor={name} 
          className={cn(
            "block overflow-hidden h-6 rounded-full cursor-pointer",
            isChecked ? "bg-bonkYellow" : "bg-gray-300",
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
        ></label>
      </div>
    </div>
  );
}
