const express = require("express");

const {
  getIntegrations,
  getAvailableIntegrations,
  connectIntegration,
  hubspotOAuthCallback,
  getHubSpotContacts,
  updateIntegration,
  getHubSpotDeals,
  syncHubSpotContactsToLeads,
  disconnectIntegration,
} = require("../controllers/integrationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ALL INTEGRATIONS
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  authMiddleware,
  getIntegrations
);

/*
|--------------------------------------------------------------------------
| GET AVAILABLE INTEGRATIONS
|--------------------------------------------------------------------------
*/
router.get(
  "/available",
  authMiddleware,
  getAvailableIntegrations
);

/*
|--------------------------------------------------------------------------
| GET HUBSPOT CONTACTS
|--------------------------------------------------------------------------
| Protected route.
|
| Frontend must send the BusinessFlow JWT token.
| The controller will:
| 1. Find the connected HubSpot integration
| 2. Check the saved access token
| 3. Refresh it if required
| 4. Fetch contacts from HubSpot
|--------------------------------------------------------------------------
*/
router.get(
  "/hubspot/contacts",
  authMiddleware,
  getHubSpotContacts
);

router.post(
  "/hubspot/sync-leads",
  authMiddleware,
  syncHubSpotContactsToLeads
);


/*
|--------------------------------------------------------------------------
| GET HUBSPOT DEALS
|--------------------------------------------------------------------------
| Protected route.
|
| Fetches real-time deals directly from HubSpot.
|--------------------------------------------------------------------------
*/
router.get(
  "/hubspot/deals",
  authMiddleware,
  getHubSpotDeals
);
/*
|--------------------------------------------------------------------------
| HUBSPOT OAUTH CALLBACK
|--------------------------------------------------------------------------
| IMPORTANT:
| This route must NOT use authMiddleware because HubSpot redirects
| the browser directly to this URL.
|--------------------------------------------------------------------------
*/
router.get(
  "/hubspot/callback",
  hubspotOAuthCallback
);

/*
|--------------------------------------------------------------------------
| CONNECT INTEGRATION
|--------------------------------------------------------------------------
*/
router.post(
  "/connect",
  authMiddleware,
  connectIntegration
);

/*
|--------------------------------------------------------------------------
| UPDATE / CONFIGURE INTEGRATION
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id",
  authMiddleware,
  updateIntegration
);

/*
|--------------------------------------------------------------------------
| DISCONNECT INTEGRATION
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  authMiddleware,
  disconnectIntegration
);

module.exports = router;