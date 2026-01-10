import * as React from "react";

export function Badge({ children, className = "", variant, ...props }: any) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${className}`}
      data-variant={variant}
      {...props}
    >
      {children}
    </span>
  );
}
