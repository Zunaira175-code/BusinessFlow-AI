import Card from "../common/Card";
import Avatar from "../common/Avatar";

const team = [
  {
    name: "Alex M.",
    deals: "12 Deals",
    revenue: "$450k",
    conversion: "32%",
    progress: 32,
    avatar: "/images/leads/alex.jpg",
  },
  {
    name: "Jessica T.",
    deals: "9 Deals",
    revenue: "$380k",
    conversion: "28%",
    progress: 28,
    avatar: "/images/leads/jessica.jpg",
  },
  {
    name: "David R.",
    deals: "6 Deals",
    revenue: "$210k",
    conversion: "18%",
    progress: 18,
  },
  {
    name: "Sam W.",
    deals: "4 Deals",
    revenue: "$160k",
    conversion: "15%",
    progress: 15,
  },
  {
    name: "Elena R.",
    deals: "2 Deals",
    revenue: "$85k",
    conversion: "8%",
    progress: 8,
  },
];

const TeamPerformance = () => {
  return (
    <Card className="h-[330px] overflow-hidden">

      {/* Header */}
      <div
        className="
          flex
          h-[55px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-[14px]
        "
      >
        <h2
          className="
            text-[13px]
            font-bold
            tracking-[-0.1px]
            text-[#102F4A]
          "
        >
          Team Performance
        </h2>

        <span
          className="
            rounded-[5px]
            bg-[#F6F8FA]
            px-[7px]
            py-[5px]
            text-[8px]
            font-medium
            text-[#6E8091]
          "
        >
          This Month
        </span>
      </div>

      {/* Table Header */}
      <div
        className="
          grid
          grid-cols-[1.3fr_0.8fr_0.8fr]
          items-center
          border-b
          border-[#DCE5ED]
          px-[12px]
          py-[8px]
        "
      >
        <span
          className="
            text-[8px]
            font-semibold
            tracking-[0.4px]
            text-[#65798B]
          "
        >
          REP
        </span>

        <span
          className="
            text-right
            text-[8px]
            font-semibold
            tracking-[0.4px]
            text-[#65798B]
          "
        >
          REV
        </span>

        <span
          className="
            text-right
            text-[8px]
            font-semibold
            tracking-[0.4px]
            text-[#65798B]
          "
        >
          CONV.
        </span>
      </div>

      {/* Team Rows */}
      <div>
        {team.map((member, index) => (
          <div
            key={member.name}
            className={`
              grid
              h-[43px]
              grid-cols-[1.3fr_0.8fr_0.8fr]
              items-center
              px-[12px]
              ${
                index !== team.length - 1
                  ? "border-b border-[#E3E9EE]"
                  : ""
              }
            `}
          >

            {/* Rep */}
            <div className="flex min-w-0 items-center gap-2">

              <Avatar
                src={member.avatar}
                alt={member.name}
                size="sm"
              />

              <div className="min-w-0">

                <p
                  className="
                    truncate
                    text-[9px]
                    font-bold
                    leading-[11px]
                    text-[#29445C]
                  "
                >
                  {member.name}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[7px]
                    font-medium
                    leading-[9px]
                    text-[#8493A1]
                  "
                >
                  {member.deals}
                </p>

              </div>
            </div>

            {/* Revenue */}
            <div className="text-right">
              <span
                className="
                  text-[9px]
                  font-bold
                  text-[#29445C]
                "
              >
                {member.revenue}
              </span>
            </div>

            {/* Conversion */}
            <div className="pl-2">

              <div className="flex items-center justify-end">
                <span
                  className="
                    text-[8px]
                    font-semibold
                    text-[#6E8192]
                  "
                >
                  {member.conversion}
                </span>
              </div>

              <div className="mt-1 ml-auto h-[4px] w-[38px] overflow-hidden rounded-full bg-[#E8EEF3]">

                <div
                  className={`
                    h-full
                    rounded-full
                    ${
                      member.progress >= 25
                        ? "bg-[#18A957]"
                        : member.progress >= 15
                          ? "bg-[#E88918]"
                          : "bg-[#EF4444]"
                    }
                  `}
                  style={{
                    width: `${member.progress}%`,
                  }}
                />

              </div>
            </div>

          </div>
        ))}
      </div>

    </Card>
  );
};

export default TeamPerformance;