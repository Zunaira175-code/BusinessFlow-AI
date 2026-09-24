import CustomersHeader from "../../components/Customers/Customerheader";
import CustomerStats from "../../components/Customers/CustomerStats";
import CustomerDirectory from "../../components/Customers/CustomerDirectory";
import RecentCustomerActivity from "../../components/Customers/RecentCustomerActivity";

const Customers = () => {
  return (
    <div className="w-full">

      {/* =====================================================
          1. CUSTOMERS HEADER
          Title + Description + Date Filter + Export + Add Customer
      ====================================================== */}
      <CustomersHeader />


      {/* =====================================================
          2. CUSTOMER STATS
          Total Customers | Active Accounts |
          New This Month | Avg. Account Value
      ====================================================== */}
      <CustomerStats />


      {/* =====================================================
          3. CUSTOMER DIRECTORY + HEALTH INTELLIGENCE
      ====================================================== */}
      <div className="mt-5 w-full">
        {/* Customer Table */}
        <CustomerDirectory />
      </div>


      {/* =====================================================
          4. RECENT CUSTOMER ACTIVITY
      ====================================================== */}
      <RecentCustomerActivity />

    </div>
  );
};

export default Customers;