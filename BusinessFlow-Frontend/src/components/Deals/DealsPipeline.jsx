import Card from "../common/Card";

const pipelineColumns = [
  {
    title: "DISCOVERY",
    count: 3,
    total: "$145,000",
    deal: {
      title: "Global Tech Migration",
      company: "Stark Industries",
      value: "$85,000",
      date: "Close: Nov 15",
      dot: "bg-[#F59E0B]",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
  },
  {
    title: "QUALIFICATION",
    count: 2,
    total: "$320,000",
    deal: {
      title: "Enterprise Software License",
      company: "Wayne Enterprises",
      value: "$250,000",
      date: "Close: Oct 30",
      dot: "bg-[#16A34A]",
      avatar: "https://i.pravatar.cc/40?img=13",
    },
  },
  {
    title: "PROPOSAL",
    count: 4,
    total: "$540,000",
    deal: {
      title: "Cloud Infrastructure Upgrade",
      company: "Cyberdyne Systems",
      value: "$410,000",
      date: "Stalled: 14 days",
      dot: "bg-[#EF4444]",
      avatar: null,
      initials: "JD",
    },
  },
];

const DealsPipeline = () => {
  return (
    <section className="mt-4 w-full">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">

        {pipelineColumns.map((column) => (
          <Card
            key={column.title}
            className="
              min-h-[365px]
              rounded-[9px]
              border
              border-[#DCE5EE]
              bg-[#F9FBFD]
              p-[12px]
              shadow-none
            "
          >
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <h3
                className="
                  text-[12px]
                  font-medium
                  tracking-[0.3px]
                  text-[#183B5A]
                "
              >
                {column.title}
              </h3>

              <span
                className="
                  flex
                  h-[22px]
                  w-[22px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#DCEAFE]
                  text-[11px]
                  font-semibold
                  text-[#174A78]
                "
              >
                {column.count}
              </span>
            </div>

            {/* Pipeline Total */}
            <p
              className="
                mt-[18px]
                text-[12px]
                font-medium
                text-[#61778B]
              "
            >
              {column.total}
            </p>

            {/* Deal Card */}
            <div
              className="
                relative
                mt-[18px]
                min-h-[105px]
                rounded-[6px]
                border
                border-[#DCE5EE]
                bg-white
                px-[12px]
                py-[11px]
                shadow-[0_1px_3px_rgba(15,42,66,0.04)]
              "
            >
              {/* Status Dot */}
              <span
                className={`
                  absolute
                  right-[-1px]
                  top-[-1px]
                  h-[7px]
                  w-[7px]
                  rounded-full
                  ${column.deal.dot}
                `}
              />

              {/* Deal Title */}
              <h4
                className="
                  pr-[10px]
                  text-[12px]
                  font-medium
                  leading-[16px]
                  text-[#173B5C]
                "
              >
                {column.deal.title}
              </h4>

              {/* Company */}
              <p
                className="
                  mt-[3px]
                  text-[11px]
                  font-medium
                  text-[#72879A]
                "
              >
                {column.deal.company}
              </p>

              {/* Value */}
              <p
                className="
                  mt-[10px]
                  text-[12px]
                  font-medium
                  text-[#183B5A]
                "
              >
                {column.deal.value}
              </p>

              {/* Bottom */}
              <div className="mt-[2px] flex items-end justify-between">
                <p
                  className="
                    text-[11px]
                    font-medium
                    text-[#7A8D9E]
                  "
                >
                  {column.deal.date}
                </p>

                {/* Avatar */}
                {column.deal.avatar ? (
                  <img
                    src={column.deal.avatar}
                    alt=""
                    className="
                      h-[18px]
                      w-[18px]
                      rounded-full
                      border
                      border-white
                      object-cover
                    "
                  />
                ) : (
                  <span
                    className="
                      flex
                      h-[18px]
                      w-[18px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#DCE8FA]
                      text-[7px]
                      font-medium
                      text-[#7190B1]
                    "
                  >
                    {column.deal.initials}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}

      </div>
    </section>
  );
};

export default DealsPipeline;