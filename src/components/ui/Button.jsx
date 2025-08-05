import { forwardRef } from "react";
import { clsx } from "clsx";

const Button = forwardRef(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      "inline-flex",
      "items-center",
      "justify-center",
      "rounded-lg",
      "font-medium",
      "transition-all",
      "duration-200",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-offset-2",
      "disabled:opacity-50",
      "disabled:cursor-not-allowed",
      "disabled:pointer-events-none",
    ];

    const variants = {
      primary: [
        "bg-gradient-to-r",
        "from-blue-600",
        "to-purple-600",
        "text-white",
        "shadow-lg",
        "hover:from-blue-700",
        "hover:to-purple-700",
        "hover:shadow-xl",
        "hover:scale-105",
        "active:scale-95",
        "focus:ring-blue-500",
      ],
      secondary: [
        "bg-gradient-to-r",
        "from-gray-100",
        "to-gray-200",
        "text-gray-800",
        "shadow-md",
        "hover:from-gray-200",
        "hover:to-gray-300",
        "hover:shadow-lg",
        "hover:scale-105",
        "active:scale-95",
        "focus:ring-gray-400",
      ],
      success: [
        "bg-gradient-to-r",
        "from-green-500",
        "to-emerald-600",
        "text-white",
        "shadow-lg",
        "hover:from-green-600",
        "hover:to-emerald-700",
        "hover:shadow-xl",
        "hover:scale-105",
        "active:scale-95",
        "focus:ring-green-500",
      ],
      danger: [
        "bg-gradient-to-r",
        "from-red-500",
        "to-rose-600",
        "text-white",
        "shadow-lg",
        "hover:from-red-600",
        "hover:to-rose-700",
        "hover:shadow-xl",
        "hover:scale-105",
        "active:scale-95",
        "focus:ring-red-500",
      ],
      outline: [
        "bg-transparent",
        "border-2",
        "border-gray-300",
        "text-gray-700",
        "hover:bg-gray-50",
        "hover:border-gray-400",
        "hover:shadow-md",
        "active:bg-gray-100",
        "focus:ring-gray-300",
      ],
    };

    const sizes = {
      sm: ["px-3", "py-1.5", "text-sm"],
      md: ["px-4", "py-2", "text-base"],
      lg: ["px-6", "py-3", "text-lg"],
      xl: ["px-8", "py-4", "text-xl"],
    };

    const buttonClasses = clsx(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
