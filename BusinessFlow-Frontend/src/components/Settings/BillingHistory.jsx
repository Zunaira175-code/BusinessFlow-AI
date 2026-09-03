import Card from "../common/Card";
import Badge from "../common/Badge";

const history = [
  {
    date: "Aug 17, 2026",
    description: "Business Plan",
    amount: "$99.00",
    status: "Paid",
  },
  {
    date: "Jul 17, 2026",
    description: "Business Plan",
    amount: "$99.00",
    status: "Paid",
  },
];

const BillingHistory = () => {
  return (
    <Card className="h-[165px] overflow-hidden px-[16px] py-[14px]">
      {/* Header */}
      <h2 className="text-[14px] font-bold text-[#102F4A]">
        Billing History
      </h2>

      {/* Table */}
      <div className="mt-[10px]">
        {/* Header */}
        <div
          className="
            grid
            grid-cols-[1.1fr_1.3fr_0.8fr_0.7fr]
            items-center
            bg-[#F7F9FC]
            px-[8px]
            py-[6px]
          "
        >
          <span className="text-[8px] font-semibold text-[#60758A]">
            Date
          </span>

          <span className="text-[8px] font-semibold text-[#60758A]">
            Description
          </span>

          <span className="text-[8px] font-semibold text-[#60758A]">
            Amount
          </span>

          <span className="text-[8px] font-semibold text-[#60758A]">
            Status
          </span>
        </div>

        {/* Rows */}
        {history.map((item) => (
          <div
            key={item.date}
            className="
              grid
              grid-cols-[1.1fr_1.3fr_0.8fr_0.7fr]
              items-center
              border-t
              border-[#DCE5ED]
              px-[8px]
              py-[7px]
            "
          >
            <span className="text-[8px] font-medium text-[#29445C]">
              {item.date}
            </span>

            <span className="text-[8px] font-medium text-[#718599]">
              {item.description}
            </span>

            <span className="text-[8px] font-semibold text-[#29445C]">
              {item.amount}
            </span>

            <Badge
              variant="success"
              className="w-fit text-[7px]"
            >
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BillingHistory;