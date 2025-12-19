import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  size?: "sm" | "default";
}) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        "flex w-full min-w-0 rounded-sm border border-ds-border-input shadow-input px-3 py-1",
        "bg-white text-ds-text-primary placeholder:text-ds-text-tertiary",
        "font-normal text-sm outline-none",
        "transition-[color,box-shadow,border-color] duration-150",
        "data-[size=default]:h-11 data-[size=sm]:h-10",
        "hover:enabled:not-focus-visible:border-ds-border-hover",
        "focus-visible:border-ds-border-active",
        "focus-visible:ring-[3px] focus-visible:ring-ds-gray-alpha-300",
        "disabled:bg-ds-gray-200",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-ds-red-900",
        "aria-invalid:hover:!border-ds-red-800",
        "aria-invalid:ring-destructive/40 aria-invalid:focus-visible:!border-ds-red-900 aria-invalid:focus-visible:!ring-ds-red-300",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent",
        "file:font-medium file:text-ds-text-primary file:text-sm",
        type === "password" && "tracking-widest placeholder:tracking-normal",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
