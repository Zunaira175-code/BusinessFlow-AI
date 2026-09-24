const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

// =====================================================
// DNS CONFIGURATION
// =====================================================

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
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");

// =====================================================
// TEST ADMIN EMAIL
// =====================================================

const ADMIN_EMAIL = "moosaj408@gmail.com";

// =====================================================
// MONGODB CONNECTION
// =====================================================

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        family: 4,
      }
    );

    console.log("MongoDB connected.");
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error
    );

    process.exit(1);
  }
};

// =====================================================
// FAKE DEALS
// =====================================================

const fakeDeals = [
  {
    title: "Custom CRM Development",
    description:
      "Complete custom CRM platform for sales and operations.",
    leadEmail:
      "john.smith@example.com",
    value: 12500,
    stage: "Prospecting",
    status: "Open",
    expectedCloseDays: 18,
    notes:
      "Client is interested in a custom CRM solution.",
  },

  {
    title: "Marketing Automation Platform",
    description:
      "Marketing automation and customer engagement platform.",
    leadEmail:
      "sarah.johnson@example.com",
    value: 8500,
    stage: "Qualification",
    status: "Open",
    expectedCloseDays: 12,
    notes:
      "Initial discussion completed. Requirements are being reviewed.",
  },

  {
    title: "Enterprise Operations System",
    description:
      "Enterprise operations management system.",
    leadEmail:
      "michael.brown@example.com",
    value: 15000,
    stage: "Qualification",
    status: "Open",
    expectedCloseDays: 25,
    notes:
      "Strong purchase intent and qualified opportunity.",
  },

  {
    title: "Cloud Migration Project",
    description:
      "Migration of existing infrastructure to cloud services.",
    leadEmail:
      "emily.davis@example.com",
    value: 22000,
    stage: "Proposal",
    status: "Open",
    expectedCloseDays: 15,
    notes:
      "Proposal has been sent and is waiting for feedback.",
  },

  {
    title: "Digital Transformation Package",
    description:
      "End-to-end digital transformation solution.",
    leadEmail:
      "david.wilson@example.com",
    value: 18500,
    stage: "Closed Won",
    status: "Won",
    expectedCloseDays: -5,
    notes:
      "Deal successfully converted.",
  },

  {
    title: "Social Media Management",
    description:
      "Social media management and campaign platform.",
    leadEmail:
      "jessica.miller@example.com",
    value: 7200,
    stage: "Closed Lost",
    status: "Lost",
    expectedCloseDays: -10,
    notes:
      "Client selected another vendor.",
  },

  {
    title: "Google Lead Generation",
    description:
      "Lead generation and analytics solution.",
    leadEmail:
      "robert.taylor@example.com",
    value: 9800,
    stage: "Prospecting",
    status: "Open",
    expectedCloseDays: 30,
    notes:
      "New inbound opportunity from Google.",
  },

  {
    title: "NextGen Enterprise Platform",
    description:
      "Enterprise-grade software platform.",
    leadEmail:
      "jennifer.anderson@example.com",
    value: 30000,
    stage: "Negotiation",
    status: "Open",
    expectedCloseDays: 20,
    notes:
      "High-value enterprise opportunity.",
  },

  {
    title: "Smart Technology Integration",
    description:
      "Technology integration across business systems.",
    leadEmail:
      "william.thomas@example.com",
    value: 17500,
    stage: "Qualification",
    status: "Open",
    expectedCloseDays: 22,
    notes:
      "Initial email conversation completed.",
  },

  {
    title: "Growth Management Solution",
    description:
      "Business growth and customer management platform.",
    leadEmail:
      "linda.jackson@example.com",
    value: 11000,
    stage: "Proposal",
    status: "Open",
    expectedCloseDays: 10,
    notes:
      "Proposal is currently under client review.",
  },

  {
    title: "Alpha Digital Platform",
    description:
      "Digital platform development for a growing company.",
    leadEmail:
      "james.white@example.com",
    value: 25000,
    stage: "Prospecting",
    status: "Open",
    expectedCloseDays: 35,
    notes:
      "Opportunity referred by an existing business contact.",
  },

  {
    title: "Creative Brand Platform",
    description:
      "Creative studio management and client platform.",
    leadEmail:
      "patricia.harris@example.com",
    value: 6500,
    stage: "Qualification",
    status: "Open",
    expectedCloseDays: 14,
    notes:
      "Initial requirements have been discussed.",
  },

  {
    title: "FinTech Enterprise Solution",
    description:
      "Large-scale fintech software development project.",
    leadEmail:
      "daniel.martin@example.com",
    value: 40000,
    stage: "Negotiation",
    status: "Open",
    expectedCloseDays: 28,
    notes:
      "Enterprise-level opportunity with strong potential.",
  },

  {
    title: "Retail Management System",
    description:
      "Retail management and business operations solution.",
    leadEmail:
      "nancy.thompson@example.com",
    value: 14500,
    stage: "Proposal",
    status: "Open",
    expectedCloseDays: 8,
    notes:
      "Proposal sent following discovery call.",
  },

  {
    title: "WebCore Business Platform",
    description:
      "Modern business website and management platform.",
    leadEmail:
      "matthew.garcia@example.com",
    value: 9000,
    stage: "Prospecting",
    status: "Open",
    expectedCloseDays: 40,
    notes:
      "Client requested additional service information.",
  },

  {
    title: "HealthTech Product Development",
    description:
      "Healthcare technology product development project.",
    leadEmail:
      "karen.martinez@example.com",
    value: 19500,
    stage: "Qualification",
    status: "Open",
    expectedCloseDays: 17,
    notes:
      "First discovery call completed successfully.",
  },

  {
    title: "Enterprise Hub IT Solution",
    description:
      "Enterprise IT management and automation solution.",
    leadEmail:
      "christopher.robinson@example.com",
    value: 35000,
    stage: "Negotiation",
    status: "Open",
    expectedCloseDays: 24,
    notes:
      "Strong enterprise prospect.",
  },

  {
    title: "BrandWorks Marketing Project",
    description:
      "Marketing platform and campaign management solution.",
    leadEmail:
      "lisa.clark@example.com",
    value: 7800,
    stage: "Closed Lost",
    status: "Lost",
    expectedCloseDays: -15,
    notes:
      "Budget was not approved.",
  },

  {
    title: "TechBridge Enterprise Deal",
    description:
      "Enterprise technology and software development package.",
    leadEmail:
      "anthony.rodriguez@example.com",
    value: 28000,
    stage: "Closed Won",
    status: "Won",
    expectedCloseDays: -3,
    notes:
      "Deal successfully converted.",
  },

  {
    title: "Future Systems Platform",
    description:
      "Future-ready software platform for business operations.",
    leadEmail:
      "barbara.lewis@example.com",
    value: 16500,
    stage: "Prospecting",
    status: "Open",
    expectedCloseDays: 32,
    notes:
      "Potential opportunity identified through outbound outreach.",
  },
];

// =====================================================
// DATE HELPER
// =====================================================

const getExpectedCloseDate = (
  daysFromNow
) => {
  const date = new Date();

  date.setDate(
    date.getDate() + daysFromNow
  );

  return date;
};

// =====================================================
// SEED DEALS
// =====================================================

const seedDeals = async () => {
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
      console.error("");
      console.error(
        "====================================================="
      );
      console.error(
        `No active admin found with email: ${ADMIN_EMAIL}`
      );
      console.error(
        "====================================================="
      );
      console.error("");

      process.exit(1);
    }

    // =================================================
    // VALIDATE COMPANY
    // =================================================

    if (!admin.companyId) {
      console.error("");
      console.error(
        "====================================================="
      );
      console.error(
        "Admin does not have a companyId."
      );
      console.error(
        `Admin email: ${admin.email}`
      );
      console.error(
        "====================================================="
      );
      console.error("");

      process.exit(1);
    }

    // =================================================
    // FIND COMPANY
    // =================================================

    const company =
      await Company.findOne({
        _id: admin.companyId,
        isActive: true,
      });

    if (!company) {
      console.error("");
      console.error(
        "====================================================="
      );
      console.error(
        "No active company found for this admin."
      );
      console.error(
        `Company ID: ${admin.companyId}`
      );
      console.error(
        "====================================================="
      );
      console.error("");

      process.exit(1);
    }

    const companyId =
      company._id;

    // =================================================
    // LOG CONFIGURATION
    // =================================================

    console.log("");
    console.log(
      "====================================================="
    );
    console.log(
      "DEAL SEED CONFIGURATION"
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
    console.log("");

    // =================================================
    // FIND ACTIVE EMPLOYEES
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

    if (employees.length === 0) {
      console.error("");
      console.error(
        "No active employees found."
      );
      console.error(
        "Deals require active employee assignments."
      );
      console.error("");

      process.exit(1);
    }

    // =================================================
    // FIND ALISHA
    // =================================================

    const alisha =
      employees.find(
        (employee) =>
          `${employee.firstName} ${employee.lastName}`
            .trim()
            .toLowerCase() ===
          "alisha fiyaaz"
      );

    if (alisha) {
      console.log(
        `Alisha Fiyaaz found: ${alisha._id}`
      );
    } else {
      console.log(
        "WARNING: Alisha Fiyaaz was not found among active employees."
      );
      console.log(
        "Normal employee distribution will be used."
      );
    }

    // =================================================
    // FIND OTHER EMPLOYEES
    // =================================================

    const otherEmployees =
      alisha
        ? employees.filter(
            (employee) =>
              String(
                employee._id
              ) !==
              String(
                alisha._id
              )
          )
        : employees;

    // =================================================
    // FIND CURRENT COMPANY LEADS
    // =================================================
    //
    // We connect demo deals to the 20 demo leads
    // created by leadsSeed.js.
    // =================================================

    const leadEmails =
      fakeDeals.map(
        (deal) =>
          deal.leadEmail
      );

    const leads =
      await Lead.find({
        companyId,
        email: {
          $in: leadEmails,
        },
      }).select(
        "_id firstName lastName email company status"
      );

    console.log(
      `Matching demo leads found: ${leads.length}`
    );

    if (
      leads.length !==
      fakeDeals.length
    ) {
      console.error("");
      console.error(
        "WARNING: Not all demo leads were found."
      );
      console.error(
        `Expected: ${fakeDeals.length}`
      );
      console.error(
        `Found   : ${leads.length}`
      );
      console.error("");
      console.error(
        "Make sure leadsSeed.js has been run first."
      );
      console.error("");

      process.exit(1);
    }

    // =================================================
    // CREATE LEAD LOOKUP
    // =================================================

    const leadMap =
      new Map();

    leads.forEach(
      (lead) => {
        leadMap.set(
          lead.email.toLowerCase(),
          lead
        );
      }
    );

    // =================================================
    // REMOVE EXISTING DEMO DEALS
    // =================================================
    //
    // Delete only these known demo deal titles.
    // Real company deals remain untouched.
    // =================================================

    const demoTitles =
      fakeDeals.map(
        (deal) =>
          deal.title
      );

    const deleted =
      await Deal.deleteMany({
        title: {
          $in: demoTitles,
        },
      });

    console.log(
      `Existing demo deals removed: ${deleted.deletedCount}`
    );

    // =================================================
    // BUILD DEALS
    // =================================================

    const now =
      new Date();

    const alishaDealCount =
      alisha
        ? Math.ceil(
            fakeDeals.length *
              0.5
          )
        : 0;

    const dealsToCreate =
      fakeDeals.map(
        (deal, index) => {
          const lead =
            leadMap.get(
              deal.leadEmail.toLowerCase()
            );

          // -------------------------------------------
          // ASSIGNMENT
          // -------------------------------------------

          let assignedTo =
            employees[
              index %
                employees.length
            ]._id;

          if (alisha) {
            // First 50% -> Alisha

            if (
              index <
              alishaDealCount
            ) {
              assignedTo =
                alisha._id;
            } else if (
              otherEmployees.length >
              0
            ) {
              // Remaining -> other employees

              const remainingIndex =
                index -
                alishaDealCount;

              assignedTo =
                otherEmployees[
                  remainingIndex %
                    otherEmployees.length
                ]._id;
            } else {
              assignedTo =
                alisha._id;
            }
          }

          // -------------------------------------------
          // CLOSE DATE
          // -------------------------------------------

          const expectedCloseDate =
            getExpectedCloseDate(
              deal.expectedCloseDays
            );

          // -------------------------------------------
          // CLOSED AT
          // -------------------------------------------

          const closedAt =
            deal.status ===
              "Won" ||
            deal.status ===
              "Lost"
              ? getExpectedCloseDate(
                  deal.expectedCloseDays
                )
              : null;

          return {
            companyId,

            title:
              deal.title,

            description:
              deal.description,

            leadId:
              lead._id,

            customerId:
              null,

            value:
              deal.value,

            stage:
              deal.stage,

            status:
              deal.status,

            assignedTo,

            expectedCloseDate,

            closedAt,

            lastActivityAt:
              now,

            notes:
              deal.notes,

            createdAt:
              now,

            updatedAt:
              now,
          };
        }
      );

    // =================================================
    // INSERT
    // =================================================

    const createdDeals =
      await Deal.insertMany(
        dealsToCreate
      );

    // =================================================
    // BASIC RESULT
    // =================================================

    const createdForCurrentCompany =
      createdDeals.filter(
        (deal) =>
          String(
            deal.companyId
          ) ===
          String(companyId)
      ).length;

    console.log("");
    console.log(
      "====================================================="
    );
    console.log(
      "DEAL SEED RESULT"
    );
    console.log(
      "====================================================="
    );
    console.log(
      `Successfully created : ${createdDeals.length}`
    );
    console.log(
      `Current company ID   : ${companyId}`
    );
    console.log(
      `Correctly assigned   : ${createdForCurrentCompany}`
    );
    console.log(
      "====================================================="
    );

    // =================================================
    // STATUS DISTRIBUTION
    // =================================================

    console.log("");
    console.log(
      "Deal status distribution:"
    );

    const statusCounts =
      {};

    createdDeals.forEach(
      (deal) => {
        statusCounts[
          deal.status
        ] =
          (statusCounts[
            deal.status
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
    // STAGE DISTRIBUTION
    // =================================================

    console.log("");
    console.log(
      "Deal stage distribution:"
    );

    const stageCounts =
      {};

    createdDeals.forEach(
      (deal) => {
        stageCounts[
          deal.stage
        ] =
          (stageCounts[
            deal.stage
          ] || 0) + 1;
      }
    );

    Object.entries(
      stageCounts
    ).forEach(
      ([stage, count]) => {
        console.log(
          `  ${stage}: ${count}`
        );
      }
    );

    // =================================================
    // TOTAL DEAL VALUE
    // =================================================

    const totalDealValue =
      createdDeals.reduce(
        (total, deal) =>
          total +
          Number(
            deal.value || 0
          ),
        0
      );

    console.log("");
    console.log(
      `Total demo deal value: $${totalDealValue.toLocaleString()}`
    );

    // =================================================
    // ASSIGNMENT DISTRIBUTION
    // =================================================

    console.log("");
    console.log(
      "Deal assignment:"
    );

    const assignmentCounts =
      {};

    createdDeals.forEach(
      (deal) => {
        const assignedId =
          String(
            deal.assignedTo
          );

        assignmentCounts[
          assignedId
        ] =
          (assignmentCounts[
            assignedId
          ] || 0) + 1;
      }
    );

    Object.entries(
      assignmentCounts
    ).forEach(
      ([userId, count]) => {
        let userName =
          "Unknown User";

        if (
          String(userId) ===
          String(admin._id)
        ) {
          userName =
            `${admin.firstName} ${admin.lastName} (Admin)`;
        } else {
          const employee =
            employees.find(
              (item) =>
                String(
                  item._id
                ) ===
                String(userId)
            );

          if (employee) {
            userName =
              `${employee.firstName} ${employee.lastName}`;
          }
        }

        console.log(
          `  ${userName}: ${count}`
        );
      }
    );

    // =================================================
    // FINAL DATABASE VERIFICATION
    // =================================================

    const totalCurrentCompanyDeals =
      await Deal.countDocuments({
        companyId,
      });

    const totalCurrentCompanyDemoDeals =
      await Deal.countDocuments({
        companyId,
        title: {
          $in: demoTitles,
        },
      });

    const alishaDealTotal =
      alisha
        ? await Deal.countDocuments({
            companyId,
            assignedTo:
              alisha._id,
            title: {
              $in: demoTitles,
            },
          })
        : 0;

    // =================================================
    // LEAD RELATION VERIFICATION
    // =================================================

    const dealsWithLeads =
      await Deal.countDocuments({
        companyId,
        title: {
          $in: demoTitles,
        },
        leadId: {
          $ne: null,
        },
      });

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
      `All deals for company       : ${totalCurrentCompanyDeals}`
    );
    console.log(
      `Demo deals for company      : ${totalCurrentCompanyDemoDeals}`
    );
    console.log(
      `Deals linked to leads       : ${dealsWithLeads}`
    );
    console.log(
      `Alisha Fiyaaz assigned deals: ${alishaDealTotal}`
    );
    console.log(
      `Company ID                  : ${companyId}`
    );
    console.log(
      "====================================================="
    );

    // =================================================
    // FINAL SUCCESS CHECK
    // =================================================

    if (
      totalCurrentCompanyDemoDeals !==
      fakeDeals.length
    ) {
      console.error("");
      console.error(
        "WARNING: Expected demo deals were not found for the current company."
      );
    } else if (
      dealsWithLeads !==
      fakeDeals.length
    ) {
      console.error("");
      console.error(
        "WARNING: Some demo deals are missing their lead relationship."
      );
    } else {
      console.log("");
      console.log(
        "SUCCESS: All demo deals belong to the current admin company."
      );

      console.log(
        "SUCCESS: All demo deals are connected to seeded leads."
      );

      if (alisha) {
        console.log(
          `SUCCESS: Alisha Fiyaaz has ${alishaDealTotal} demo deals assigned.`
        );
      }
    }

    // =================================================
    // COMPLETED
    // =================================================

    console.log("");
    console.log(
      "====================================================="
    );
    console.log(
      "Deal seeding completed successfully."
    );
    console.log(
      `Company: ${company.name}`
    );
    console.log(
      `Company ID: ${companyId}`
    );
    console.log(
      "====================================================="
    );
  } catch (error) {
    console.error("");
    console.error(
      "Deal Seed Error:",
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

    await seedDeals();

    await mongoose.connection.close();

    console.log("");
    console.log(
      "MongoDB connection closed."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Deal seed process failed:",
      error
    );

    try {
      await mongoose.connection.close();
    } catch {}

    process.exit(1);
  }
};

run();