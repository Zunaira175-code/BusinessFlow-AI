const Card = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`
        rounded-[10px]
        border
        border-[#DDE5EC]
        bg-white
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;