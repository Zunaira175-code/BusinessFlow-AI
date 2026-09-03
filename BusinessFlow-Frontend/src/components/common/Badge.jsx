const Badge = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: `
      bg-[#F1F5F8]
      text-[#49647C]
    `,

    success: `
      bg-[#ECFDF3]
      text-[#15803D]
    `,

    warning: `
      bg-[#FFF7E8]
      text-[#B45309]
    `,

    danger: `
      bg-[#FEF2F2]
      text-[#DC2626]
    `,

    info: `
      bg-[#EFF6FF]
      text-[#2563EB]
    `,

    purple: `
      bg-[#F5F3FF]
      text-[#7C3AED]
    `,
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-semibold
        leading-none
        whitespace-nowrap
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;