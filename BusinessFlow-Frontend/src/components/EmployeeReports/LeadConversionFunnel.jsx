const funnel = [
  {
    label: "New",
    value: "1,240",
    width: "100%",
    className: "bg-[#0B3155]",
  },
  {
    label: "Contacted",
    value: "856",
    width: "88%",
    className: "bg-[#234D76]",
  },
  {
    label: "Qualified",
    value: "412",
    width: "72%",
    className: "bg-[#496984]",
  },
  {
    label: "Proposal",
    value: "185",
    width: "60%",
    className: "bg-[#607990]",
  },
  {
    label: "Won",
    value: "44",
    width: "48%",
    className: "bg-[#71879B]",
  },
];

const LeadConversionFunnel = () => {
  return (
    <section
      className="
        h-[238px]
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
        p-4
      "
    >
      <h2 className="text-[13px] font-bold text-[#17324D]">
        Lead Conversion Funnel
      </h2>

      {/* Funnel */}
      <div className="mt-4 flex flex-col items-center gap-[3px]">
        {funnel.map((item) => (
          <div
            key={item.label}
            className={`
              flex
              h-[25px]
              items-center
              justify-between
              rounded-[4px]
              px-3
              text-[8px]
              font-semibold
              text-white
              ${item.className}
            `}
            style={{
              width: item.width,
            }}
          >
            <span>{item.label}</span>

            <span>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-[7px] border-t border-[#DCE5ED] pt-3 text-center">
        <p className="text-[7px] text-[#7A8B9A]">
          Average deal velocity:{" "}
          <span className="font-semibold text-[#17324D]">
            18 days
          </span>
        </p>
      </div>
    </section>
  );
};

export default LeadConversionFunnel;