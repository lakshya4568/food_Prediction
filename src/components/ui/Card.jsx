import { forwardRef } from "react";
import { clsx } from "clsx";

const Card = forwardRef(
  (
    {
      children,
      className,
      variant = "default",
      padding = "md",
      shadow = "md",
      rounded = "lg",
      hover = false,
      border = false,
      gradient = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      "bg-white",
      "dark:bg-gray-800",
      "transition-all",
      "duration-200",
    ];

    const variants = {
      default: ["border-gray-200", "dark:border-gray-700"],
      elevated: ["shadow-lg", "hover:shadow-xl"],
      outlined: ["border-2", "border-gray-200", "dark:border-gray-600"],
      glass: [
        "bg-white/10",
        "dark:bg-gray-900/10",
        "backdrop-blur-sm",
        "border",
        "border-white/20",
        "dark:border-gray-700/20",
      ],
    };

    const paddings = {
      none: [],
      sm: ["p-3"],
      md: ["p-4"],
      lg: ["p-6"],
      xl: ["p-8"],
    };

    const shadows = {
      none: [],
      sm: ["shadow-sm"],
      md: ["shadow-md"],
      lg: ["shadow-lg"],
      xl: ["shadow-xl"],
      "2xl": ["shadow-2xl"],
    };

    const roundedOptions = {
      none: [],
      sm: ["rounded-sm"],
      md: ["rounded-md"],
      lg: ["rounded-lg"],
      xl: ["rounded-xl"],
      "2xl": ["rounded-2xl"],
      "3xl": ["rounded-3xl"],
    };

    const hoverClasses = hover
      ? ["hover:shadow-lg", "hover:scale-[1.02]", "cursor-pointer"]
      : [];

    const borderClasses = border
      ? ["border", "border-gray-200", "dark:border-gray-700"]
      : [];

    const gradientClasses = gradient
      ? [
          "bg-gradient-to-br",
          "from-white",
          "to-gray-50",
          "dark:from-gray-800",
          "dark:to-gray-900",
        ]
      : [];

    const cardClasses = clsx(
      baseClasses,
      variants[variant],
      paddings[padding],
      shadows[shadow],
      roundedOptions[rounded],
      hoverClasses,
      borderClasses,
      gradientClasses,
      className
    );

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card Header Component
const CardHeader = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "mb-4",
        "border-b",
        "border-gray-200",
        "dark:border-gray-700",
        "pb-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

// Card Title Component
const CardTitle = forwardRef(
  ({ children, className, size = "lg", ...props }, ref) => {
    const sizes = {
      sm: "text-sm font-medium",
      md: "text-base font-semibold",
      lg: "text-lg font-semibold",
      xl: "text-xl font-bold",
      "2xl": "text-2xl font-bold",
    };

    return (
      <h3
        ref={ref}
        className={clsx(
          "text-gray-900",
          "dark:text-white",
          "leading-tight",
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

// Card Content Component
const CardContent = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "text-gray-600",
        "dark:text-gray-300",
        "leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

// Card Footer Component
const CardFooter = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "mt-4",
        "pt-3",
        "border-t",
        "border-gray-200",
        "dark:border-gray-700",
        "flex",
        "items-center",
        "justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

// Export all components
export default Card;
export { CardHeader, CardTitle, CardContent, CardFooter };
