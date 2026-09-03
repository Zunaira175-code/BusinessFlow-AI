import CustomerPageHeader from "../../components/EmployeeCustomer/CustomerPageHeader";
import CustomerStats from "../../components/EmployeeCustomer/CustomerStats";
import CustomerFilters from "../../components/EmployeeCustomer/CustomerFilters";
import CustomerList from "../../components/EmployeeCustomer/CustomerList";
import CustomerActivity from "../../components/EmployeeCustomer/CustomerActivity";
import UpcomingFollowUps from "../../components/EmployeeCustomer/UpcomingFollowUps";

const EmployeeCustomers = () => {
  return (
    <div className="w-full">

      {/* Page Header */}
      <CustomerPageHeader />

      {/* Customer Stats */}
      <div className="mt-4">
        <CustomerStats />
      </div>

      {/* Search + Filters */}
      <div className="mt-4">
        <CustomerFilters />
      </div>

      {/* Customer List */}
      <div className="mt-4">
        <CustomerList />
      </div>

      {/* Activity + Upcoming Follow-ups */}
      <div
        className="
          mt-4
          grid
          w-full
          grid-cols-1
          gap-3
          lg:grid-cols-[1.2fr_1fr]
        "
      >
        <CustomerActivity />
        <UpcomingFollowUps />
      </div>

    </div>
  );
};

export default EmployeeCustomers;