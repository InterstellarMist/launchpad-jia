const variantStyles = {
  variant: {
    primary: {
      background: "black",
      color: "#FFFFFF",
      border: "1px solid #E9EAEB",
    },
    secondary: {
      background: "#FFFFFF",
      color: "#414651",
      border: "1px solid #D5D7DA",
    },
    ghost: {
      background: "transparent",
      color: "#535862",
      border: "none",
    },
    destructive: {
      background: "transparent",
      color: "#B32318",
      border: "1px solid #FDA29B",
    },
  },
  size: {
    xs: {
      padding: "6px",
    },
    sm: {
      padding: "8px 14px",
    },
    md: {
      padding: "12px 20px",
    },
  },
};

export const Button = ({
  text,
  onClick,
  variant = "primary",
  icon,
  iconSize = 20,
  size = "sm",
  disabled = false,
  children,
}: {
  text?: string;
  onClick: () => void;
  variant: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  iconSize?: number;
  size?: "xs" | "sm" | "md";
  disabled?: boolean;
  children?: React.ReactNode;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        width: "fit-content",
        background: variantStyles.variant[variant].background,
        color: variantStyles.variant[variant].color,
        border: disabled
          ? "1px solid #E9EAEB"
          : variantStyles.variant[variant].border,
        padding: text ? variantStyles.size[size].padding : "6px",
        borderRadius: "60px",
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: "fit-content",
      }}
      tabIndex={disabled ? -1 : 0}
      onFocus={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}
      aria-disabled={disabled}
      disabled={disabled}
    >
      {icon && <img src={icon} alt="icon" height={iconSize} width={iconSize} />}
      {text && (
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: disabled ? "#D5D7DA" : variantStyles.variant[variant].color,
          }}
        >
          {text}
        </span>
      )}
      {children}
    </button>
  );
};
