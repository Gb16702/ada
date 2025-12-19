import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium text-sm outline-none transition-colors duration-150 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-ds-border-input disabled:bg-ds-gray-100 disabled:text-ds-gray-700 aria-invalid:border-ds-danger aria-invalid:ring-ds-danger-ring/50 min-w-[50px] has-[>svg]:min-w-0 [&_svg:not([class*='size-'])]:size-4.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border border-transparent bg-ds-action text-white hover:bg-ds-action-hover focus-visible:ring-ds-action-ring",
        "primary-subtle":
          "border border-transparent bg-ds-action-subtle hover:bg-ds-action-subtle-hover text-ds-action-text focus-visible:ring-ds-action-ring",
        secondary:
          "border border-ds-border-input bg-ds-background-100 text-ds-text-primary hover:border-ds-border-hover hover:bg-ds-gray-100 focus-visible:border-ds-border-active focus-visible:ring-ds-gray-600/40",
        destructive:
          "border border-transparent bg-ds-danger text-white hover:bg-ds-danger-hover focus-visible:ring-ds-danger-ring",
        ghost:
          "border border-transparent text-ds-text-secondary hover:text-ds-text-primary hover:bg-ds-gray-600/12 focus-visible:border-ds-border-active focus-visible:ring-ds-gray-600/40",
        outline:
          "border border-ds-action-text bg-ds-background-100 text-ds-action-text hover:border-ds-border-hover hover:bg-ds-gray-100 focus-visible:border-ds-border-active focus-visible:ring-ds-gray-600/40",
        text: "text-ds-text-primary border border-transparent focus-visible:border-ds-border-active focus-visible:ring-ds-gray-600/40",
      },
      size: {
        sm: "h-7 px-2.5 md:h-8 md:px-3",
        md: "h-8 px-3 has-[>svg]:px-3 md:h-9 md:px-4",
        lg: "h-9 px-4.5 has-[>svg]:px-4.5 md:h-10 md:px-4.5",
        xl: "h-11 px-4.5 has-[>svg]:px-4.5",
        "2xl": "h-12 px-6 has-[>svg]:px-5",
      },
      radius: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      radius: "sm",
    },
  },
);

function Button({
  className,
  variant,
  size,
  radius,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, radius, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
