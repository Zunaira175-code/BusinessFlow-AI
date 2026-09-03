const IconButton = ({
  icon: Icon,
  size = 20,
  label,
  variant = "default",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) => {
  const variants = {
    default: `
      text-[#334B61]
      hover:bg-[#F3F6F9]
      hover:text-[#0B3D6B]
    `,

    bordered: `
      border
      border-[#D8E1E9]
      bg-white
      text-[#334B61]
      hover:bg-[#F8FAFC]
      hover:border-[#C5D1DC]
    `,

    light: `
      bg-[#F3F6F9]
      text-[#334B61]
      hover:bg-[#E8EEF3]
      hover:text-[#0B3D6B]
    `,

    danger: `
      text-[#EF4444]
      hover:bg-[#FEF2F2]
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`
        inline-flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-full
        transition-all
        duration-200
        active:scale-[0.95]
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    >
      {Icon && (
        <Icon
          size={size}
          strokeWidth={1.8}
        />
      )}
    </button>
  );
};

export default IconButton;