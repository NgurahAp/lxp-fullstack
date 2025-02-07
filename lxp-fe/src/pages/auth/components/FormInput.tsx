// src/components/FormInput/FormInput.tsx
import React, { useState } from "react";

interface FormInputProps {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean; // Menambahkan prop disabled
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  id,
  name,
  placeholder,
  label,
  required = false,
  value,
  onChange,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mt-1 block w-full h-10 pl-4 rounded-md shadow-sm transition duration-200 ${
          isFocused ? "border-blue-500" : "border-gray-300"
        } bg-gray-50 focus:border-blue-500 focus:outline-none ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default FormInput;
