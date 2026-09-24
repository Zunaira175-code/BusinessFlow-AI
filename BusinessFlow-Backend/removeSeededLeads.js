require("dotenv").config();

const mongoose = require("mongoose");
const Lead = require("./src/models/Lead");
const connectDB = require("./src/config/db");

const removeSeededLeads = async () => {
  try {
    console.log("");
    console.log("==========================================");
    console.log("       REMOVE SEEDED LEADS");
    console.log("==========================================");
    console.log("");

    // Connect MongoDB
    await connectDB();

    console.log("MongoDB connected.");
    console.log("");

    // --------------------------------------------------
    // FIRST: SHOW CURRENT LEADS
    // --------------------------------------------------

    const allLeads = await Lead.find({})
      .select(
        "firstName lastName email source hubspotContactId companyId"
      )
      .lean();

    console.log(
      "Total leads before cleanup:",
      allLeads.length
    );

    console.log("");

    // --------------------------------------------------
    // HUBSPOT LEADS
    // --------------------------------------------------

    const hubspotLeads = allLeads.filter(
      (lead) => Boolean(lead.hubspotContactId)
    );

    // --------------------------------------------------
    // NON-HUBSPOT LEADS
    // --------------------------------------------------

    const nonHubspotLeads = allLeads.filter(
      (lead) => !lead.hubspotContactId
    );

    console.log(
      "HubSpot leads to KEEP:",
      hubspotLeads.length
    );

    console.log(
      "Leads without HubSpot ID:",
      nonHubspotLeads.length
    );

    console.log("");

    // --------------------------------------------------
    // SHOW HUBSPOT LEADS
    // --------------------------------------------------

    console.log("------------------------------------------");
    console.log("HUBSPOT LEADS - WILL BE KEPT");
    console.log("------------------------------------------");

    hubspotLeads.forEach((lead) => {
      console.log(
        `KEEP: ${lead.firstName} ${lead.lastName} | ${lead.email} | HubSpot ID: ${lead.hubspotContactId}`
      );
    });

    console.log("");

    // --------------------------------------------------
    // SHOW NON-HUBSPOT LEADS
    // --------------------------------------------------

    console.log("------------------------------------------");
    console.log("NON-HUBSPOT LEADS - WILL BE REMOVED");
    console.log("------------------------------------------");

    nonHubspotLeads.forEach((lead) => {
      console.log(
        `REMOVE: ${lead.firstName} ${lead.lastName} | ${lead.email} | Source: ${lead.source}`
      );
    });

    console.log("");

    // --------------------------------------------------
    // DELETE ONLY LEADS WITHOUT HUBSPOT CONTACT ID
    // --------------------------------------------------

    const deleteResult = await Lead.deleteMany({
      hubspotContactId: null,
    });

    console.log("------------------------------------------");
    console.log("CLEANUP RESULT");
    console.log("------------------------------------------");

    console.log(
      "Deleted seeded/non-HubSpot leads:",
      deleteResult.deletedCount
    );

    // --------------------------------------------------
    // VERIFY
    // --------------------------------------------------

    const remainingLeads = await Lead.find({})
      .select(
        "firstName lastName email source hubspotContactId"
      )
      .lean();

    console.log("");

    console.log(
      "Remaining leads:",
      remainingLeads.length
    );

    console.log("");

    remainingLeads.forEach((lead) => {
      console.log(
        `KEEP: ${lead.firstName} ${lead.lastName} | ${lead.email} | Source: ${lead.source} | HubSpot ID: ${lead.hubspotContactId}`
      );
    });

    console.log("");
    console.log("==========================================");
    console.log("       CLEANUP COMPLETED");
    console.log("==========================================");
    console.log("");

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("");
    console.error("==========================================");
    console.error("       CLEANUP ERROR");
    console.error("==========================================");
    console.error("");
    console.error(error);
    console.error("");

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error(
        "Connection close error:",
        closeError.message
      );
    }

    process.exit(1);
  }
};

removeSeededLeads();