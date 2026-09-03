const rows = [
  {
    metric: "Lead Quality",
    current: "Score: 82/100",
    previous: "Score: 78/100",
    change: "+5%",
    changeClass: "text-[#16A05D]",
    status: "Excellent",
    statusClass: "bg-[#E8F7EF] text-[#16A05D]",
  },
  {
    metric: "Meeting Efficiency",
    current: "42 Meetings",
    previous: "38 Meetings",
    change: "+10.5%",
    changeClass: "text-[#16A05D]",
    status: "Good",
    statusClass: "bg-[#E8F7EF] text-[#16A05D]",
  },
  {
    metric: "Follow-up Consistency",
    current: "92% within 24h",
    previous: "95% within 24h",
    change: "-3%",
    changeClass: "text-[#F08A00]",
    status: "Monitor",
    statusClass: "bg-[#FFF1DF] text-[#E58A00]",
  },
  {
    metric: "Revenue Growth",
    current: "$142k MRR",
    previous: "$126k MRR",
    change: "+12.7%",
    changeClass: "text-[#16A05D]",
    status: "Excellent",
    statusClass: "bg-[#E8F7EF] text-[#16A05D]",
  },
];

const RecentPerformance = () => {
  return (
    <section
      className="
        h-[238px]
        overflow-hidden
        rounded-[9px]
        border
        border-[#DCE5ED]
        bg-white
      "
    >
      {/* Header */}
      <div className="h-[52px] border-b border-[#DCE5ED] px-4 py-4">
        <h2 className="text-[13px] font-bold text-[#17324D]">
          Recent Performance Breakdowns
        </h2>
      </div>

      {/* Table */}
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="h-[31px] bg-[#F7F9FB]">
              <th className="px-3 text-left text-[7px] font-semibold text-[#60758A]">
                Metric
              </th>

              <th className="px-2 text-left text-[7px] font-semibold text-[#60758A]">
                Current Period
              </th>

              <th className="px-2 text-left text-[7px] font-semibold text-[#60758A]">
                Previous Period
              </th>

              <th className="px-2 text-left text-[7px] font-semibold text-[#60758A]">
                Change
              </th>

              <th className="px-2 text-left text-[7px] font-semibold text-[#60758A]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.metric}
                className="
                  h-[38px]
                  border-t
                  border-[#E4EBF1]
                "
              >
                <td className="whitespace-nowrap px-3 text-[7px] font-medium text-[#17324D]">
                  {row.metric}
                </td>

                <td className="whitespace-nowrap px-2 text-[7px] text-[#425B70]">
                  {row.current}
                </td>

                <td className="whitespace-nowrap px-2 text-[7px] text-[#60758A]">
                  {row.previous}
                </td>

                <td
                  className={`
                    whitespace-nowrap
                    px-2
                    text-[7px]
                    font-semibold
                    ${row.changeClass}
                  `}
                >
                  {row.change}
                </td>

                <td className="px-2">
                  <span
                    className={`
                      inline-flex
                      rounded-[4px]
                      px-[7px]
                      py-[3px]
                      text-[6px]
                      font-semibold
                      ${row.statusClass}
                    `}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentPerformance;