import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "bg-surface rounded-2xl shadow-lg transition-all duration-200 hand-drawn-border";
  
  const variants = {
    default: "p-6",
    compact: "p-4",
    large: "p-8",
    hover: "p-6 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;