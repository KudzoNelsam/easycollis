import * as React from "react";

export function Helpers({ children, className = "", ...props }: any) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
