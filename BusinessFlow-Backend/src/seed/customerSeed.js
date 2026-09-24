const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

mongoose.set("strictQuery", false);

// =====================================================
// MODELS
// =====================================================

const Company = require("../models/Company");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Task = require("../models/Task");

// =====================================================
// ADMIN
// =====================================================

const ADMIN_EMAIL = "moosaj408@gmail.com";

// =====================================================
// DEMO CUSTOMER DATA
// =====================================================

const fakeCustomers = [
  {
    firstName: "James",
    lastName: "Wilson",
    companyName: "NovaTech Solutions",
    industry: "Technology",
    email: "james.wilson@novatech-demo.com",
    phone: "+1 415 555 0101",
    jobTitle: "Chief Technology Officer",
    status: "Active",
    totalRevenue: 85000,
    accountValue: 120000,
    healthScore: 91,
    healthStatus: "Healthy",
    healthMessage: "Strong engagement and consistent growth.",
  },

  {
    firstName: "Sarah",
    lastName: "Mitchell",
    companyName: "BrightPath Consulting",
    industry: "Consulting",
    email: "sarah.mitchell@brightpath-demo.com",
    phone: "+1 415 555 0102",
    jobTitle: "Managing Director",
    status: "Active",
    totalRevenue: 62000,
    accountValue: 95000,
    healthScore: 86,
    healthStatus: "Healthy",
    healthMessage: "Healthy account with regular activity.",
  },

  {
    firstName: "Michael",
    lastName: "Brown",
    companyName: "Vertex Manufacturing",
    industry: "Manufacturing",
    email: "michael.brown@vertex-demo.com",
    phone: "+1 415 555 0103",
    jobTitle: "Operations Director",
    status: "Pending",
    totalRevenue: 18000,
    accountValue: 45000,
    healthScore: 72,
    healthStatus: "Neutral",
    healthMessage: "Recently onboarded customer.",
  },

  {
    firstName: "Emily",
    lastName: "Davis",
    companyName: "CloudBridge Systems",
    industry: "Cloud Services",
    email: "emily.davis@cloudbridge-demo.com",
    phone: "+1 415 555 0104",
    jobTitle: "VP Engineering",
    status: "Active",
    totalRevenue: 94000,
    accountValue: 140000,
    healthScore: 94,
    healthStatus: "Expansion Opportunity",
    healthMessage: "High potential for account expansion.",
  },

  {
    firstName: "Daniel",
    lastName: "Taylor",
    companyName: "PrimeRetail Group",
    industry: "Retail",
    email: "daniel.taylor@primeretail-demo.com",
    phone: "+1 415 555 0105",
    jobTitle: "Head of Digital",
    status: "Active",
    totalRevenue: 73000,
    accountValue: 110000,
    healthScore: 82,
    healthStatus: "Healthy",
    healthMessage: "Stable account with strong engagement.",
  },

  {
    firstName: "Jessica",
    lastName: "Anderson",
    companyName: "HealthCore Labs",
    industry: "Healthcare",
    email: "jessica.anderson@healthcore-demo.com",
    phone: "+1 415 555 0106",
    jobTitle: "Product Director",
    status: "Pending",
    totalRevenue: 12500,
    accountValue: 38000,
    healthScore: 69,
    healthStatus: "Neutral",
    healthMessage: "Account is completing onboarding.",
  },

  {
    firstName: "Robert",
    lastName: "Thomas",
    companyName: "FinEdge Capital",
    industry: "Financial Services",
    email: "robert.thomas@finedge-demo.com",
    phone: "+1 415 555 0107",
    jobTitle: "Technology Director",
    status: "Active",
    totalRevenue: 112000,
    accountValue: 175000,
    healthScore: 96,
    healthStatus: "Expansion Opportunity",
    healthMessage: "Strong opportunity for additional services.",
  },

  {
    firstName: "Jennifer",
    lastName: "Moore",
    companyName: "BlueWave Logistics",
    industry: "Logistics",
    email: "jennifer.moore@bluewave-demo.com",
    phone: "+1 415 555 0108",
    jobTitle: "Operations Manager",
    status: "Active",
    totalRevenue: 49000,
    accountValue: 78000,
    healthScore: 88,
    healthStatus: "Healthy",
    healthMessage: "Good customer engagement.",
  },

  {
    firstName: "William",
    lastName: "Martin",
    companyName: "UrbanBuild Partners",
    industry: "Construction",
    email: "william.martin@urbanbuild-demo.com",
    phone: "+1 415 555 0109",
    jobTitle: "Managing Partner",
    status: "Pending",
    totalRevenue: 21000,
    accountValue: 52000,
    healthScore: 76,
    healthStatus: "Neutral",
    healthMessage: "New account awaiting final onboarding steps.",
  },

  {
    firstName: "Linda",
    lastName: "Jackson",
    companyName: "CreativeWorks Studio",
    industry: "Media",
    email: "linda.jackson@creativeworks-demo.com",
    phone: "+1 415 555 0110",
    jobTitle: "Studio Director",
    status: "Active",
    totalRevenue: 57000,
    accountValue: 82000,
    healthScore: 84,
    healthStatus: "Healthy",
    healthMessage: "Consistent engagement and positive activity.",
  },

  {
    firstName: "Christopher",
    lastName: "White",
    companyName: "DataSphere Analytics",
    industry: "Data & Analytics",
    email: "christopher.white@datasphere-demo.com",
    phone: "+1 415 555 0111",
    jobTitle: "Head of Analytics",
    status: "Active",
    totalRevenue: 99000,
    accountValue: 150000,
    healthScore: 92,
    healthStatus: "Expansion Opportunity",
    healthMessage: "Customer is exploring additional services.",
  },

  {
    firstName: "Patricia",
    lastName: "Harris",
    companyName: "GreenCore Energy",
    industry: "Energy",
    email: "patricia.harris@greencore-demo.com",
    phone: "+1 415 555 0112",
    jobTitle: "Business Director",
    status: "Inactive",
    totalRevenue: 34000,
    accountValue: 60000,
    healthScore: 48,
    healthStatus: "At Risk",
    healthMessage: "Customer engagement has decreased recently.",
  },

  {
    firstName: "Matthew",
    lastName: "Clark",
    companyName: "SecureNet Technologies",
    industry: "Cybersecurity",
    email: "matthew.clark@securenet-demo.com",
    phone: "+1 415 555 0113",
    jobTitle: "Security Director",
    status: "Active",
    totalRevenue: 88000,
    accountValue: 135000,
    healthScore: 89,
    healthStatus: "Healthy",
    healthMessage: "Strong product adoption.",
  },

  {
    firstName: "Nancy",
    lastName: "Lewis",
    companyName: "MarketPulse Agency",
    industry: "Marketing",
    email: "nancy.lewis@marketpulse-demo.com",
    phone: "+1 415 555 0114",
    jobTitle: "Agency Director",
    status: "Active",
    totalRevenue: 45000,
    accountValue: 72000,
    healthScore: 80,
    healthStatus: "Healthy",
    healthMessage: "Regular engagement with account team.",
  },

  {
    firstName: "Anthony",
    lastName: "Walker",
    companyName: "SmartHome Innovations",
    industry: "IoT",
    email: "anthony.walker@smarthome-demo.com",
    phone: "+1 415 555 0115",
    jobTitle: "Founder",
    status: "Pending",
    totalRevenue: 16500,
    accountValue: 42000,
    healthScore: 67,
    healthStatus: "Neutral",
    healthMessage: "Customer is completing initial setup.",
  },

  {
    firstName: "Barbara",
    lastName: "Hall",
    companyName: "EduFuture Platform",
    industry: "Education",
    email: "barbara.hall@edufuture-demo.com",
    phone: "+1 415 555 0116",
    jobTitle: "Program Director",
    status: "Active",
    totalRevenue: 68000,
    accountValue: 100000,
    healthScore: 87,
    healthStatus: "Healthy",
    healthMessage: "Strong engagement from the customer team.",
  },

  {
    firstName: "Steven",
    lastName: "Allen",
    companyName: "RetailOne Group",
    industry: "E-Commerce",
    email: "steven.allen@retailone-demo.com",
    phone: "+1 415 555 0117",
    jobTitle: "Digital Commerce Director",
    status: "Inactive",
    totalRevenue: 29000,
    accountValue: 55000,
    healthScore: 42,
    healthStatus: "At Risk",
    healthMessage: "Customer activity has declined.",
  },

  {
    firstName: "Susan",
    lastName: "Young",
    companyName: "TravelCore",
    industry: "Travel",
    email: "susan.young@travelcore-demo.com",
    phone: "+1 415 555 0118",
    jobTitle: "Operations Director",
    status: "Active",
    totalRevenue: 61000,
    accountValue: 90000,
    healthScore: 90,
    healthStatus: "Healthy",
    healthMessage: "Strong account relationship.",
  },

  {
    firstName: "Joseph",
    lastName: "King",
    companyName: "AutoTech Mobility",
    industry: "Automotive",
    email: "joseph.king@autotech-demo.com",
    phone: "+1 415 555 0119",
    jobTitle: "Technology Manager",
    status: "Active",
    totalRevenue: 76000,
    accountValue: 115000,
    healthScore: 85,
    healthStatus: "Expansion Opportunity",
    healthMessage: "Potential for additional technology services.",
  },

  {
    firstName: "Karen",
    lastName: "Wright",
    companyName: "WellnessPlus",
    industry: "Wellness",
    email: "karen.wright@wellnessplus-demo.com",
    phone: "+1 415 555 0120",
    jobTitle: "Operations Director",
    status: "Active",
    totalRevenue: 53000,
    accountValue: 88000,
    healthScore: 45,
    healthStatus: "At Risk",
    healthMessage: "Follow-up is recommended due to reduced engagement.",
  },
];

// =====================================================
// DATE HELPERS
// =====================================================

const getDateFromNow = (days) => {
  const date = new Date();

  date.setDate(
    date.getDate() + days
  );

  return date;
};

const getStartOfToday = () => {
  const date = new Date();

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
};

const getDateAtHour = (
  daysFromToday,
  hour = 10
) => {
  const date =
    getStartOfToday();

  date.setDate(
    date.getDate() +
      daysFromToday
  );

  date.setHours(
    hour,
    0,
    0,
    0
  );

  return date;
};

// =====================================================
// CONNECT DATABASE
// =====================================================

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        family: 4,
      }
    );

    console.log(
      "MongoDB connected."
    );
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error
    );

    process.exit(1);
  }
};

// =====================================================
// SEED CUSTOMERS
// =====================================================

const seedCustomers = async () => {
  try {
    // =================================================
    // FIND ADMIN
    // =================================================

    const admin =
      await User.findOne({
        email:
          ADMIN_EMAIL.toLowerCase(),
        role: "admin",
        isActive: true,
      }).select(
        "_id companyId firstName lastName email"
      );

    if (!admin) {
      console.error(
        `No active admin found: ${ADMIN_EMAIL}`
      );

      process.exit(1);
    }

    // =================================================
    // COMPANY
    // =================================================

    const company =
      await Company.findOne({
        _id: admin.companyId,
        isActive: true,
      });

    if (!company) {
      console.error(
        "Active company not found."
      );

      process.exit(1);
    }

    const companyId =
      company._id;

    console.log("");
    console.log(
      "====================================================="
    );
    console.log(
      "CUSTOMER SEED CONFIGURATION"
    );
    console.log(
      "====================================================="
    );
    console.log(
      `Admin email : ${admin.email}`
    );
    console.log(
      `Admin       : ${admin.firstName} ${admin.lastName}`
    );
    console.log(
      `Company     : ${company.name}`
    );
    console.log(
      `Company ID  : ${companyId}`
    );
    console.log(
      "====================================================="
    );

    // =================================================
    // EMPLOYEES
    // =================================================

    const employees =
      await User.find({
        companyId,
        role: "employee",
        isActive: true,
      }).select(
        "_id firstName lastName email"
      );

    console.log(
      `Active employees found: ${employees.length}`
    );

    if (
      employees.length === 0
    ) {
      console.error(
        "No active employees found."
      );

      process.exit(1);
    }

    // =================================================
    // REMOVE OLD DEMO CUSTOMERS
    // =================================================

    const demoEmails =
      fakeCustomers.map(
        (customer) =>
          customer.email
      );

    const deletedCustomers =
      await Customer.deleteMany({
        companyId,
        email: {
          $in: demoEmails,
        },
      });

    console.log(
      `Existing demo customers removed: ${deletedCustomers.deletedCount}`
    );

    // =================================================
    // REMOVE OLD DEMO TASKS
    // =================================================

    const deletedTasks =
      await Task.deleteMany({
        companyId,
        title: {
          $regex:
            /^Demo Customer Follow-up/,
        },
      });

    console.log(
      `Existing demo follow-up tasks removed: ${deletedTasks.deletedCount}`
    );

    // =================================================
    // CREATE CUSTOMERS
    // =================================================

    const customersToCreate =
      fakeCustomers.map(
        (customer, index) => {
          const assignedEmployee =
            employees[
              index %
                employees.length
            ];

          return {
            companyId,

            firstName:
              customer.firstName,

            lastName:
              customer.lastName,

            companyName:
              customer.companyName,

            industry:
              customer.industry,

            email:
              customer.email.toLowerCase(),

            phone:
              customer.phone,

            jobTitle:
              customer.jobTitle,

            status:
              customer.status,

            accountManager:
              assignedEmployee._id,

            totalRevenue:
              customer.totalRevenue,

            accountValue:
              customer.accountValue,

            healthScore:
              customer.healthScore,

            healthStatus:
              customer.healthStatus,

            healthMessage:
              customer.healthMessage,

            notes:
              `Demo customer seeded for BusinessFlow AI.`,

            lastActivityAt:
              getDateFromNow(
                -index
              ),

            createdAt:
              getDateFromNow(
                -index
              ),

            updatedAt:
              new Date(),
          };
        }
      );

    const createdCustomers =
      await Customer.insertMany(
        customersToCreate
      );

    console.log("");
    console.log(
      "====================================================="
    );
    console.log(
      "CUSTOMER SEED RESULT"
    );
    console.log(
      "====================================================="
    );
    console.log(
      `Successfully created : ${createdCustomers.length}`
    );
    console.log(
      `Current company ID   : ${companyId}`
    );
    console.log(
      "====================================================="
    );

    // =================================================
    // ASSIGNMENT DISTRIBUTION
    // =================================================

    console.log("");
    console.log(
      "Customer assignment:"
    );

    const assignmentCounts =
      {};

    createdCustomers.forEach(
      (customer) => {
        const id =
          String(
            customer.accountManager
          );

        assignmentCounts[id] =
          (assignmentCounts[id] ||
            0) + 1;
      }
    );

    Object.entries(
      assignmentCounts
    ).forEach(
      ([userId, count]) => {
        const employee =
          employees.find(
            (item) =>
              String(
                item._id
              ) === userId
          );

        if (employee) {
          console.log(
            `  ${employee.firstName} ${employee.lastName}: ${count}`
          );
        }
      }
    );

    // =================================================
    // CUSTOMER STATUS
    // =================================================

    console.log("");
    console.log(
      "Customer status distribution:"
    );

    const statusCounts =
      {};

    createdCustomers.forEach(
      (customer) => {
        statusCounts[
          customer.status
        ] =
          (statusCounts[
            customer.status
          ] || 0) + 1;
      }
    );

    Object.entries(
      statusCounts
    ).forEach(
      ([status, count]) => {
        console.log(
          `  ${status}: ${count}`
        );
      }
    );

    // =================================================
    // HEALTH STATUS
    // =================================================

    console.log("");
    console.log(
      "Customer health distribution:"
    );

    const healthCounts =
      {};

    createdCustomers.forEach(
      (customer) => {
        healthCounts[
          customer.healthStatus
        ] =
          (healthCounts[
            customer.healthStatus
          ] || 0) + 1;
      }
    );

    Object.entries(
      healthCounts
    ).forEach(
      ([status, count]) => {
        console.log(
          `  ${status}: ${count}`
        );
      }
    );

    // =================================================
    // CREATE FOLLOW-UP TASKS
    // =================================================

    const followUpCustomers =
      createdCustomers.slice(
        0,
        10
      );

    const tasksToCreate =
      followUpCustomers.map(
        (customer, index) => {
          const dueDays =
            index % 3 === 0
              ? 0
              : index % 3 === 1
              ? -1
              : 2;

          const assignedTo =
            customer.accountManager;

          return {
            companyId,

            title:
              `Demo Customer Follow-up ${index + 1}`,

            description:
              "Demo follow-up task connected to seeded customer.",

            customerId:
              customer._id,

            leadId:
              null,

            dealId:
              null,

            assignedTo,

            createdBy:
              admin._id,

            status:
              index === 8
                ? "In Progress"
                : "Pending",

            priority:
              index % 3 === 0
                ? "HIGH"
                : index % 3 === 1
                ? "MEDIUM"
                : "LOW",

            dueAt:
              getDateAtHour(
                dueDays,
                10 + (index % 4)
              ),

            completedAt:
              null,

            notes:
              "Seeded demo customer follow-up.",

            createdAt:
              new Date(),

            updatedAt:
              new Date(),
          };
        }
      );

    const createdTasks =
      await Task.insertMany(
        tasksToCreate
      );

    console.log("");
    console.log(
      `Demo follow-up tasks created: ${createdTasks.length}`
    );

    // =================================================
    // DATABASE VERIFICATION
    // =================================================

    const totalCompanyCustomers =
      await Customer.countDocuments({
        companyId,
      });

    const totalDemoCustomers =
      await Customer.countDocuments({
        companyId,
        email: {
          $in: demoEmails,
        },
      });

    const totalCompanyTasks =
      await Task.countDocuments({
        companyId,
        title: {
          $regex:
            /^Demo Customer Follow-up/,
        },
      });

    const atRiskCustomers =
      await Customer.countDocuments({
        companyId,
        email: {
          $in: demoEmails,
        },
        healthStatus:
          "At Risk",
      });

    // =================================================
    // FINAL OUTPUT
    // =================================================

    console.log("");
    console.log(
      "====================================================="
    );
    console.log(
      "DATABASE VERIFICATION"
    );
    console.log(
      "====================================================="
    );
    console.log(
      `All customers for company : ${totalCompanyCustomers}`
    );
    console.log(
      `Demo customers            : ${totalDemoCustomers}`
    );
    console.log(
      `Demo follow-up tasks      : ${totalCompanyTasks}`
    );
    console.log(
      `At-risk demo customers    : ${atRiskCustomers}`
    );
    console.log(
      `Company ID                : ${companyId}`
    );
    console.log(
      "====================================================="
    );

    if (
      totalDemoCustomers ===
      fakeCustomers.length
    ) {
      console.log("");
      console.log(
        "SUCCESS: All demo customers belong to the current company."
      );
    }

    console.log(
      "SUCCESS: Customers are assigned across active employees."
    );

    console.log(
      "SUCCESS: Demo follow-up tasks were created."
    );

    console.log("");
    console.log(
      "Customer seeding completed successfully."
    );
  } catch (error) {
    console.error("");
    console.error(
      "Customer Seed Error:",
      error
    );
    console.error("");

    process.exit(1);
  }
};

// =====================================================
// RUN
// =====================================================

const run = async () => {
  try {
    await connectDB();

    await seedCustomers();

    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Customer seed process failed:",
      error
    );

    try {
      await mongoose.connection.close();
    } catch {}

    process.exit(1);
  }
};

run();