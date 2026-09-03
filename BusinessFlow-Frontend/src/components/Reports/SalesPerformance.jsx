const SalesPerformance = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // Values are in millions
  const actual = [2.4, 2.8, 3.4, 3.6, 4.0, 4.8];
  const projected = [2.4, 2.8, 3.5, 3.6, 4.0, 4.8];

  const maxValue = 5;

  return (
    <section className="w-full rounded-[9px] border border-[#DCE5EF] bg-white p-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#102A43]">
          Sales Performance
        </h2>

        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded text-[#526B82] hover:bg-[#F3F6F9]"
          aria-label="More options"
        >
          <span className="text-[17px] leading-none">⋮</span>
        </button>
      </div>

      {/* Chart */}
      <div className="mt-3 flex">

        {/* Y Axis */}
        <div className="flex h-[176px] w-[31px] shrink-0 flex-col justify-between pb-[20px] pt-[1px]">
          <span className="text-[8px] text-[#8293A3]">$5M</span>
          <span className="text-[8px] text-[#8293A3]">$4M</span>
          <span className="text-[8px] text-[#8293A3]">$3M</span>
          <span className="text-[8px] text-[#8293A3]">$2M</span>
          <span className="text-[8px] text-[#8293A3]">$1M</span>
          <span className="text-[8px] text-[#8293A3]">0</span>
        </div>

        {/* Chart Area */}
        <div className="relative h-[176px] flex-1 border-b border-l border-[#DCE5EF]">

          {/* Grid Lines */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-[20px]">
            {[0, 1, 2, 3, 4, 5].map((line) => (
              <div
                key={line}
                className="w-full border-t border-dashed border-[#E3EAF1]"
              />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-x-2 bottom-[20px] top-0 flex items-end justify-between">

            {months.map((month, index) => {
              const actualHeight = `${(actual[index] / maxValue) * 100}%`;
              const projectedHeight = `${(projected[index] / maxValue) * 100}%`;

              return (
                <div
                  key={month}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  {/* Bar Group */}
                  <div className="flex h-full items-end justify-center gap-[2px]">

                    {/* Actual */}
                    <div
                      className="w-[12px] rounded-t-[1px] bg-[#3B628F]"
                      style={{ height: actualHeight }}
                    />

                    {/* Projected */}
                    <div
                      className="w-[12px] rounded-t-[1px] bg-[#AFC9ED]"
                      style={{ height: projectedHeight }}
                    />
                  </div>

                  {/* Month */}
                  <div className="absolute bottom-[-17px] flex w-[30px] justify-center">
                    <span className="text-[8px] text-[#8293A3]">
                      {month}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1">
          <span className="h-[7px] w-[7px] rounded-full bg-[#3B628F]" />
          <span className="text-[8px] text-[#8293A3]">
            Actual
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="h-[7px] w-[7px] rounded-full bg-[#AFC9ED]" />
          <span className="text-[8px] text-[#8293A3]">
            Projected
          </span>
        </div>
      </div>
    </section>
  );
};

export default SalesPerformance;