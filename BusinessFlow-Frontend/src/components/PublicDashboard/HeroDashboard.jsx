import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  UserRound,
  CheckSquare,
  BarChart3,
  Settings,
  Search,
  Bell,
  MoreHorizontal,
} from "lucide-react";

const HeroDashboard = () => {
  return (
    <div className="relative w-full">

      {/* =====================================================
          DASHBOARD WRAPPER
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[610px]
          origin-center
          rotate-[-3deg]
          transform
        "
      >

        {/* =================================================
            DASHBOARD WINDOW
        ================================================= */}

        <div
          className="
            overflow-hidden
            rounded-[8px]
            border
            border-[#C7D7E7]
            bg-white
            shadow-[0_22px_45px_rgba(20,52,85,0.18)]
          "
        >

          {/* =================================================
              TOP HEADER
          ================================================= */}

          <div
            className="
              flex
              h-[28px]
              items-center
              justify-between
              border-b
              border-[#E2E8EF]
              bg-white
              px-3
            "
          >

            {/* Search */}

            <div
              className="
                flex
                h-[16px]
                w-[120px]
                items-center
                gap-1.5
                rounded-[3px]
                border
                border-[#E5EBF1]
                bg-[#FAFBFC]
                px-2
              "
            >

              <Search
                size={7}
                strokeWidth={1.7}
                className="text-[#8D9BA8]"
              />

              <span className="text-[4px] text-[#9AA6B1]">
                Search...
              </span>

            </div>


            {/* Right controls */}

            <div className="flex items-center gap-2">

              <Bell
                size={8}
                strokeWidth={1.7}
                className="text-[#81909E]"
              />

              <MoreHorizontal
                size={9}
                className="text-[#81909E]"
              />

              <div className="h-[14px] w-[14px] rounded-full bg-[#DCEAF8]" />

            </div>

          </div>


          {/* =================================================
              DASHBOARD BODY
          ================================================= */}

          <div className="flex bg-[#F7F9FC]">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
              className="
                w-[67px]
                shrink-0
                bg-[#072B4D]
                px-[6px]
                py-[8px]
              "
            >

              {/* Logo */}

              <div className="mb-[10px] flex items-center gap-[4px]">

                <div
                  className="
                    flex
                    h-[13px]
                    w-[13px]
                    items-center
                    justify-center
                    rounded-[3px]
                    bg-white
                  "
                >
                  <span className="text-[5px] font-bold text-[#0B3D6B]">
                    B
                  </span>
                </div>

                <span className="text-[4px] font-semibold text-white">
                  BusinessFlow
                </span>

              </div>


              {/* Menu */}

              <div className="space-y-[3px]">

                <DashboardMenu
                  active
                  icon={LayoutDashboard}
                  label="Dashboard"
                />

                <DashboardMenu
                  icon={Users}
                  label="Leads"
                />

                <DashboardMenu
                  icon={UserRound}
                  label="Customers"
                />

                <DashboardMenu
                  icon={BriefcaseBusiness}
                  label="Deals"
                />

                <DashboardMenu
                  icon={CheckSquare}
                  label="Tasks"
                />

                <DashboardMenu
                  icon={BarChart3}
                  label="Analytics"
                />

                <DashboardMenu
                  icon={BarChart3}
                  label="Reports"
                />

              </div>


              <div className="my-[8px] border-t border-[#31516C]" />

              <DashboardMenu
                icon={Settings}
                label="Settings"
              />

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="min-w-0 flex-1 p-[8px]">

              {/* Dashboard heading */}

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-[8px] font-semibold text-[#102A42]">
                    Dashboard
                  </h3>

                  <p className="mt-[2px] text-[4px] text-[#8A99A7]">
                    Overview of your sales performance
                  </p>

                </div>


                <div
                  className="
                    flex
                    h-[15px]
                    items-center
                    rounded-[3px]
                    border
                    border-[#DCE5ED]
                    bg-white
                    px-2
                  "
                >
                  <span className="text-[4px] text-[#738493]">
                    This Month
                  </span>
                </div>

              </div>


              {/* =================================================
                  STAT CARDS
              ================================================= */}

              <div className="mt-[6px] grid grid-cols-3 gap-[5px]">

                <StatCard
                  title="Total Leads"
                  value="2,543"
                  change="+18.5%"
                />

                <StatCard
                  title="Deals in Pipeline"
                  value="$78,420"
                  change="+24.5%"
                />

                <StatCard
                  title="Won Deals"
                  value="1,287"
                  change="+8.2%"
                />

              </div>


              {/* =================================================
                  LOWER CONTENT
              ================================================= */}

              <div className="mt-[6px] grid grid-cols-[1fr_0.92fr] gap-[5px]">


                {/* Lead Sources */}

                <div
                  className="
                    rounded-[5px]
                    border
                    border-[#DFE7EE]
                    bg-white
                    p-[7px]
                  "
                >

                  <h4 className="text-[5px] font-semibold text-[#17334C]">
                    Lead Sources
                  </h4>


                  <div className="mt-[6px] flex items-center gap-[8px]">

                    {/* Donut */}

                    <div
                      className="
                        relative
                        h-[48px]
                        w-[48px]
                        shrink-0
                        rounded-full
                      "
                      style={{
                        background:
                          "conic-gradient(#176FD1 0deg 162deg, #5B9DE3 162deg 252deg, #86B9E9 252deg 324deg, #D7E8F8 324deg 360deg)",
                      }}
                    >

                      <div
                        className="
                          absolute
                          left-1/2
                          top-1/2
                          h-[25px]
                          w-[25px]
                          -translate-x-1/2
                          -translate-y-1/2
                          rounded-full
                          bg-white
                        "
                      />

                    </div>


                    {/* Legend */}

                    <div className="space-y-[4px]">

                      <Legend
                        label="Website"
                        value="45%"
                      />

                      <Legend
                        label="Referral"
                        value="25%"
                      />

                      <Legend
                        label="Social Media"
                        value="20%"
                      />

                      <Legend
                        label="Email"
                        value="10%"
                      />

                    </div>

                  </div>

                </div>


                {/* Recent Activity */}

                <div
                  className="
                    rounded-[5px]
                    border
                    border-[#DFE7EE]
                    bg-white
                    p-[7px]
                  "
                >

                  <h4 className="text-[5px] font-semibold text-[#17334C]">
                    Recent Activity
                  </h4>


                  <div className="mt-[5px] space-y-[5px]">

                    <Activity
                      text="New lead from Website"
                      time="2 min ago"
                    />

                    <Activity
                      text="Deal updated"
                      time="15 min ago"
                    />

                    <Activity
                      text="Follow-up scheduled"
                      time="1 hr ago"
                    />

                    <Activity
                      text="Task completed"
                      time="3 hrs ago"
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  MINI TABLE
              ================================================= */}

              <div
                className="
                  mt-[5px]
                  overflow-hidden
                  rounded-[5px]
                  border
                  border-[#DFE7EE]
                  bg-white
                "
              >

                <div className="border-b border-[#E9EEF3] px-[7px] py-[5px]">

                  <h4 className="text-[5px] font-semibold text-[#17334C]">
                    Recent Deals
                  </h4>

                </div>


                <div className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr] px-[7px] py-[4px]">

                  <span className="text-[3.5px] text-[#8D9BA7]">
                    Customer
                  </span>

                  <span className="text-[3.5px] text-[#8D9BA7]">
                    Deal
                  </span>

                  <span className="text-[3.5px] text-[#8D9BA7]">
                    Value
                  </span>

                  <span className="text-[3.5px] text-[#8D9BA7]">
                    Status
                  </span>

                </div>


                <DealRow
                  customer="Acme Corporation"
                  deal="Enterprise"
                  value="$8.5K"
                  status="Won"
                />

                <DealRow
                  customer="Tech Solutions"
                  deal="CRM Upgrade"
                  value="$5.2K"
                  status="Open"
                />

              </div>

            </main>

          </div>

        </div>


        {/* =================================================
            AI BADGE
        ================================================= */}

        

      </div>

    </div>
  );
};


/* =========================================================
   DASHBOARD MENU
========================================================= */

const DashboardMenu = ({
  icon: Icon,
  label,
  active = false,
}) => {
  return (
    <div
      className={`
        flex
        items-center
        gap-[4px]
        rounded-[3px]
        px-[4px]
        py-[3px]
        ${
          active
            ? "bg-[#15528A] text-white"
            : "text-[#A8BDD0]"
        }
      `}
    >

      <Icon
        size={7}
        strokeWidth={1.8}
      />

      <span className="text-[3.5px] font-medium">
        {label}
      </span>

    </div>
  );
};


/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  title,
  value,
  change,
}) => {
  return (
    <div
      className="
        rounded-[5px]
        border
        border-[#E0E7EE]
        bg-white
        p-[6px]
      "
    >

      <p className="text-[3.7px] text-[#8796A4]">
        {title}
      </p>

      <p className="mt-[3px] text-[9px] font-semibold text-[#102A42]">
        {value}
      </p>

      <p className="mt-[2px] text-[3.6px] font-semibold text-[#20A463]">
        ↑ {change}
      </p>

    </div>
  );
};


/* =========================================================
   LEGEND
========================================================= */

const Legend = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-[7px]">

      <div className="flex items-center gap-[3px]">

        <span className="h-[4px] w-[4px] rounded-full bg-[#2879D7]" />

        <span className="text-[3.6px] text-[#687989]">
          {label}
        </span>

      </div>

      <span className="text-[3.5px] font-medium text-[#718293]">
        {value}
      </span>

    </div>
  );
};


/* =========================================================
   ACTIVITY
========================================================= */

const Activity = ({
  text,
  time,
}) => {
  return (
    <div className="flex items-center gap-[4px]">

      <div
        className="
          flex
          h-[10px]
          w-[10px]
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#EAF4FF]
        "
      >
        <Users
          size={5}
          className="text-[#2175CF]"
        />
      </div>

      <span className="min-w-0 flex-1 truncate text-[3.5px] text-[#596D7F]">
        {text}
      </span>

      <span className="text-[3.2px] text-[#99A5B0]">
        {time}
      </span>

    </div>
  );
};


/* =========================================================
   DEAL ROW
========================================================= */

const DealRow = ({
  customer,
  deal,
  value,
  status,
}) => {
  return (
    <div className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr] border-t border-[#F0F3F6] px-[7px] py-[4px]">

      <span className="truncate text-[3.5px] text-[#536879]">
        {customer}
      </span>

      <span className="truncate text-[3.5px] text-[#7B8A98]">
        {deal}
      </span>

      <span className="text-[3.5px] text-[#536879]">
        {value}
      </span>

      <span
        className={`text-[3.5px] font-semibold ${
          status === "Won"
            ? "text-[#1CA15D]"
            : "text-[#2879D7]"
        }`}
      >
        {status}
      </span>

    </div>
  );
};

export default HeroDashboard;