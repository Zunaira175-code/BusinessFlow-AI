require("dotenv").config();

const connectDB = require("../config/db");

const Company = require("../models/Company");
const Integration = require("../models/Integration");

// =====================================================
// DEFAULT INTEGRATIONS
// =====================================================

const integrations = [
  // ===================================================
  // CONNECTED INTEGRATIONS SECTION
  // ===================================================

  {
    name: "Slack",
    key: "slack",
    category: "connected",
    status: "disconnected",
    description:
      "Receive BusinessFlow AI notifications and team activity in Slack.",
    icon: "slack",
  },

  {
    name: "Google Workspace",
    key: "google_workspace",
    category: "connected",
    status: "disconnected",
    description:
      "Connect Google Workspace services with BusinessFlow AI.",
    icon: "google",
  },

  // ===================================================
  // AVAILABLE INTEGRATIONS SECTION
  // ===================================================

  {
    name: "HubSpot",
    key: "hubspot",
    category: "available",
    status: "disconnected",
    description:
      "Sync HubSpot contacts and CRM data with BusinessFlow AI.",
    icon: "hubspot",
  },

  {
    name: "Stripe",
    key: "stripe",
    category: "available",
    status: "disconnected",
    description:
      "Connect Stripe payments, customers, and subscriptions.",
    icon: "stripe",
  },

  {
    name: "Google Calendar",
    key: "google_calendar",
    category: "available",
    status: "disconnected",
    description:
      "Sync meetings and calendar events with BusinessFlow AI.",
    icon: "google_calendar",
  },
];

// =====================================================
// SEED INTEGRATIONS
// =====================================================

const seedIntegrations = async () => {
  try {
    // ---------------------------------------------------
    // CONNECT DATABASE
    // ---------------------------------------------------

    await connectDB();

    console.log(
      "\nStarting integrations seed..."
    );

    // ---------------------------------------------------
    // GET COMPANIES
    // ---------------------------------------------------

    const companies = await Company.find({});

    if (!companies.length) {
      console.log(
        "No companies found in database."
      );

      console.log(
        "Please create a company/account first."
      );

      process.exit(0);
    }

    // ---------------------------------------------------
    // CREATE INTEGRATIONS FOR EACH COMPANY
    // ---------------------------------------------------

    let createdCount = 0;
    let existingCount = 0;

    for (const company of companies) {
      console.log(
        `\nCompany: ${company.name}`
      );

      for (const integrationData of integrations) {
        const existing =
          await Integration.findOne({
            companyId: company._id,
            key: integrationData.key,
          });

        if (existing) {
          console.log(
            `  Already exists: ${integrationData.name}`
          );

          existingCount++;

          continue;
        }

        await Integration.create({
          companyId: company._id,
          ...integrationData,
        });

        console.log(
          `  Created: ${integrationData.name}`
        );

        createdCount++;
      }
    }

    // ---------------------------------------------------
    // SUMMARY
    // ---------------------------------------------------

    console.log("\n========================================");
    console.log("INTEGRATIONS SEED COMPLETED");
    console.log("========================================");

    console.log(
      `Created: ${createdCount}`
    );

    console.log(
      `Already existed: ${existingCount}`
    );

    console.log(
      `Companies processed: ${companies.length}`
    );

    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error(
      "\nIntegration Seed Error:"
    );

    console.error(error);

    process.exit(1);
  }
};

// =====================================================
// RUN SEED
// =====================================================

seedIntegrations();