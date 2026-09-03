const Button = ({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  type = "button",
  onClick,
  disabled = false,
}) => {
  const variants = {
    primary: `
      bg-[#0B3D6B]
      text-white
      hover:bg-[#09365F]
      shadow-[0_2px_5px_rgba(11,61,107,0.15)]
    `,

    secondary: `
      border
      border-[#D8E1E9]
      bg-white
      text-[#193B5B]
      hover:bg-[#F8FAFC]
      hover:border-[#C5D1DC]
    `,

    light: `
      border
      border-[#D8E1E9]
      bg-[#F8FAFC]
      text-[#193B5B]
      hover:bg-[#F1F5F8]
    `,

    danger: `
      bg-[#EF4444]
      text-white
      hover:bg-[#DC2626]
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        h-[40px]
        items-center
        justify-center
        gap-2
        rounded-[9px]
        px-4
        text-[13px]
        font-medium
        whitespace-nowrap
        transition-all
        duration-200
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    >
      {Icon && (
        <Icon
          size={15}
          strokeWidth={2}
        />
      )}

      {children}
    </button>
  );
};

export default Button;