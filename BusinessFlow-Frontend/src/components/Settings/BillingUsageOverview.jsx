import Card from "../common/Card";

const usage = [
  {
    name: "Contacts",
    value: "7,842 / 10,000",
    percent: 78,
    color: "bg-[#0B3D6B]",
  },
  {
    name: "AI Credits",
    value: "6,420 / 10,000",
    percent: 64,
    color: "bg-[#1592D0]",
  },
  {
    name: "Team Members",
    value: "12 / 25",
    percent: 48,
    color: "bg-[#0B3D6B]",
  },
  {
    name: "Storage",
    value: "48 GB / 100 GB",
    percent: 48,
    color: "bg-[#0B3D6B]",
  },
];

const BillingUsageOverview = () => {
  return (
    <Card className="h-[250px] overflow-hidden px-[16px] py-[14px]">
      <h2 className="text-[14px] font-bold text-[#102F4A]">
        Usage Overview
      </h2>

      <div className="mt-[18px] space-y-[14px]">
        {usage.map((item) => (
          <div key={item.name}>
            {/* Label */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-medium text-[#62788C]">
                {item.name}
              </span>

              <span className="text-[8px] font-semibold text-[#29445C]">
                {item.value}
              </span>
            </div>

            {/* Progress */}
            <div className="mt-[5px] h-[5px] w-full overflow-hidden rounded-full bg-[#EEF1F4]">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{
                  width: `${item.percent}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BillingUsageOverview;