import { MoreHorizontal } from "lucide-react";
import Card from "../common/Card";
import IconButton from "../common/IconButton";

const months = [
  { month: "Jan", height: "65px", type: "actual" },
  { month: "Feb", height: "95px", type: "actual" },
  { month: "Mar", height: "75px", type: "actual" },
  { month: "Apr", height: "125px", type: "actual", active: true },
  { month: "May", height: "105px", type: "projected" },
  { month: "Jun", height: "115px", type: "projected" },
];

const SalesPipeline = () => {
  return (
    <Card className="overflow-hidden">

      {/* Header */}
      <div className="flex h-[62px] items-center justify-between border-b border-[#DDE5EC] px-[14px]">
        <div>
          <h2 className="text-[13px] font-bold text-[#102F4A]">
            Sales Pipeline Trend
          </h2>

          <p className="mt-[2px] text-[9px] font-medium text-[#8192A2]">
            Revenue forecasting across stages
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* Actual */}
          <div className="flex items-center gap-1">
            <span className="h-[7px] w-[7px] rounded-full bg-[#0B3D6B]" />

            <span className="text-[9px] font-medium text-[#62778B]">
              Actual
            </span>
          </div>

          {/* Projected */}
          <div className="flex items-center gap-1">
            <span className="h-[7px] w-[7px] rounded-full border border-[#D5E0EB] bg-[#EFF4FB]" />

            <span className="text-[9px] font-medium text-[#8797A6]">
              Projected
            </span>
          </div>

          <IconButton
            icon={MoreHorizontal}
            label="More options"
            size={15}
            className="h-6 w-6 rounded-md"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="px-[16px] pb-[10px] pt-[14px]">

        <div className="relative h-[215px]">

          {/* Y Axis */}
          <div className="absolute left-0 top-0 flex h-[170px] w-[30px] flex-col justify-between">
            <span className="text-[8px] text-[#A1AFBB]">
              $1.5M
            </span>

            <span className="text-[8px] text-[#A1AFBB]">
              $1.0M
            </span>

            <span className="text-[8px] text-[#A1AFBB]">
              $0.5M
            </span>

            <span className="text-[8px] text-[#A1AFBB]">
              $0
            </span>
          </div>

          {/* Chart */}
          <div className="absolute left-[32px] right-0 top-0 h-[170px]">

            {/* Grid */}
            <div className="absolute inset-x-0 top-0 border-t border-[#EDF1F5]" />

            <div className="absolute inset-x-0 top-[35%] border-t border-[#EDF1F5]" />

            <div className="absolute inset-x-0 top-[70%] border-t border-[#EDF1F5]" />

            <div className="absolute inset-x-0 bottom-0 border-t border-[#EDF1F5]" />

            {/* Bars */}
            <div className="absolute inset-x-[18px] bottom-0 flex h-full items-end justify-between gap-[10px]">

              {months.map((item) => {
                const projected = item.type === "projected";

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 items-end justify-center"
                  >
                    <div
                      className={`
                        w-full
                        max-w-[60px]
                        rounded-t-[2px]
                        border
                        ${
                          item.active
                            ? "border-[#0B3D6B] bg-[#0B3D6B]"
                            : projected
                              ? "border-[#DCE7F5] bg-[#EEF4FC]"
                              : "border-[#C6D9F1] bg-[#C6D9F1]"
                        }
                      `}
                      style={{
                        height: item.height,
                      }}
                    />
                  </div>
                );
              })}

            </div>
          </div>

          {/* Month Labels */}
          <div className="absolute bottom-0 left-[45px] right-[5px] flex justify-between">
            {months.map((item) => (
              <span
                key={item.month}
                className={
                  item.active
                    ? "text-[9px] font-bold text-[#173B5C]"
                    : "text-[9px] font-medium text-[#718599]"
                }
              >
                {item.month}
              </span>
            ))}
          </div>

        </div>
      </div>

    </Card>
  );
};

export default SalesPipeline;