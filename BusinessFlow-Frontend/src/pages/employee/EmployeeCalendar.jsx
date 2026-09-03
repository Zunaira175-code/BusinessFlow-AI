import CalendarHeader from "../../components/EmployeeCalendar/CalendarHeader";
import CalendarGrid from "../../components/EmployeeCalendar/CalendarGrid";
import TodaysSchedule from "../../components/EmployeeCalendar/TodaysSchedule";
import UpcomingEvents from "../../components/EmployeeCalendar/UpcomingEvents";
import TasksDue from "../../components/EmployeeCalendar/TasksDue";

const EmployeeCalendar = () => {
  return (
    <div className="w-full">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <CalendarHeader
        onAddEvent={() => {
          console.log("New Event clicked");
        }}
      />

      {/* =====================================================
          CALENDAR CONTENT
      ====================================================== */}

      <div
        className="
          mt-4
          grid
          w-full
          grid-cols-1
          gap-3
          xl:grid-cols-[minmax(0,1fr)_225px]
        "
      >

        {/* =================================================
            LEFT — CALENDAR
        ================================================== */}

        <div className="min-w-0">
          <CalendarGrid />
        </div>

        {/* =================================================
            RIGHT — SIDEBAR CARDS
        ================================================== */}

        <div className="space-y-3">

          <TodaysSchedule />

          <UpcomingEvents />

          <TasksDue />

        </div>
      </div>
    </div>
  );
};

export default EmployeeCalendar;