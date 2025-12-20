import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium text-sm rounded-sm outline-none transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-action text-white hover:bg-action-hover focus-visible:ring-action",
        secondary:
          "border border-ds-border-input bg-ds-background-100 text-ds-text-primary hover:border-ds-border-hover hover:bg-ds-gray-100 focus-visible:border-ds-border-active focus-visible:ring-ds-gray-600/40",
        destructive:
          "bg-ds-red-700 text-white hover:bg-ds-red-800 focus-visible:ring-ds-red-200",
        ghost: "hover:bg-ds-gray-100 text-ds-gray-700",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
