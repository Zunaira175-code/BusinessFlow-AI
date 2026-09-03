const IntegrationCard = ({
  icon: Icon,
  name,
  description,
  action = "Connect",
  iconClassName = "text-[#315D80]",
}) => {
  return (
    <div
      className="
        flex
        min-h-[84px]
        items-center
        justify-between
        gap-3
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        px-3
        py-3
        transition-colors
        hover:border-[#C8D8E6]
        hover:bg-[#FCFDFE]
      "
    >
      {/* Icon + Content */}
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`
            flex
            h-[34px]
            w-[34px]
            shrink-0
            items-center
            justify-center
            rounded-[7px]
            bg-[#F7F9FC]
            ${iconClassName}
          `}
        >
          {Icon && <Icon size={16} strokeWidth={1.8} />}
        </div>

        <div className="min-w-0">
          <h3 className="text-[9px] font-bold text-[#17324D]">
            {name}
          </h3>

          <p className="mt-1 max-w-[170px] text-[8px] leading-[12px] text-[#718599]">
            {description}
          </p>
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        className="
          shrink-0
          text-[8px]
          font-semibold
          text-[#173B5C]
          transition-colors
          hover:text-[#079BEA]
        "
      >
        {action}
      </button>
    </div>
  );
};

export default IntegrationCard;