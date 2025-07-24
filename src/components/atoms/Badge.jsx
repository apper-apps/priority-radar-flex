import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "primary", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary/20 to-error/20 text-primary border border-primary/30",
    secondary: "bg-gradient-to-r from-secondary/20 to-info/20 text-secondary border border-secondary/30",
    success: "bg-gradient-to-r from-success/20 to-secondary/20 text-success border border-success/30",
    warning: "bg-gradient-to-r from-warning/20 to-accent/20 text-warning border border-warning/30",
    error: "bg-gradient-to-r from-error/20 to-primary/20 text-error border border-error/30"
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;