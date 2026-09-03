import CustomersHeader from "../../components/Customers/Customerheader";
import CustomerStats from "../../components/Customers/CustomerStats";
import CustomerDirectory from "../../components/Customers/CustomerDirectory";
import CustomerHealthIntelligence from "../../components/Customers/CustomerHealthIntelligence";
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
      <section
        className="
          mt-5
          grid
          w-full
          grid-cols-[minmax(0,1fr)_200px]
          gap-4
        "
      >
        {/* Customer Table */}
        <CustomerDirectory />

        {/* AI Customer Health */}
        <CustomerHealthIntelligence />
      </section>


      {/* =====================================================
          4. RECENT CUSTOMER ACTIVITY
      ====================================================== */}
      <RecentCustomerActivity />

    </div>
  );
};

export default Customers;