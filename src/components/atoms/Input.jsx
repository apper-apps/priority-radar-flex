import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(baseStyles, error && "border-error focus:border-error focus:ring-error/20", className)}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;