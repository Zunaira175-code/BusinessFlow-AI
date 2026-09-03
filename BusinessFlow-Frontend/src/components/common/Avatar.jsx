const Avatar = ({
  src,
  alt = "User",
  size = "md",
  className = "",
}) => {
  const sizes = {
    xs: "h-6 w-6",
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        shrink-0
        overflow-hidden
        rounded-full
        border
        border-[#DCE4EC]
        bg-[#EEF3F7]
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-[#49647C]">
          {alt?.charAt(0)?.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;