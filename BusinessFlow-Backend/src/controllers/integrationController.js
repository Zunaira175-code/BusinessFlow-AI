const crypto = require("crypto");
const Integration = require("../models/Integration");
const Lead = require("../models/Lead");

/*
|--------------------------------------------------------------------------
| NORMALIZE COMPANY ID
|--------------------------------------------------------------------------
| req.user.companyId can sometimes be:
| 1. ObjectId
| 2. Populated Company document/object
|
| Integration.companyId requires an ObjectId.
|--------------------------------------------------------------------------
*/
const getCompanyId = (companyId) => {
  if (!companyId) {
    return null;
  }

  if (typeof companyId === "object" && companyId._id) {
    return companyId._id.toString();
  }

  return companyId.toString();
};

/*
|--------------------------------------------------------------------------
| GET VALID HUBSPOT ACCESS TOKEN
|--------------------------------------------------------------------------
| HubSpot access tokens are short-lived.
|
| If the current access token is still valid, use it.
| If it is expired or about to expire, use the refresh token
| to obtain a new access token and save it in MongoDB.
|--------------------------------------------------------------------------
*/
const getHubSpotAccessToken = async (integration) => {
  if (!integration || !integration.oauth) {
    throw new Error("HubSpot OAuth information is missing.");
  }

  const {
    accessToken,
    refreshToken,
    expiresAt,
  } = integration.oauth;

  /*
  |--------------------------------------------------------------------------
  | USE CURRENT ACCESS TOKEN IF STILL VALID
  |--------------------------------------------------------------------------
  | We keep a 60-second safety buffer.
  |--------------------------------------------------------------------------
  */
  if (
    accessToken &&
    expiresAt &&
    new Date(expiresAt).getTime() > Date.now() + 60 * 1000
  ) {
    return accessToken;
  }

  /*
  |--------------------------------------------------------------------------
  | REFRESH TOKEN REQUIRED
  |--------------------------------------------------------------------------
  */
  if (!refreshToken) {
    throw new Error(
      "HubSpot refresh token is missing. Please reconnect HubSpot."
    );
  }

  console.log("");
  console.log("==========================================");
  console.log("      HUBSPOT TOKEN REFRESH");
  console.log("==========================================");
  console.log("Refreshing HubSpot access token...");

  /*
  |--------------------------------------------------------------------------
  | REFRESH HUBSPOT TOKEN
  |--------------------------------------------------------------------------
  */
  const refreshResponse = await fetch(
    "https://api.hubapi.com/oauth/2026-03/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        refresh_token: refreshToken,
      }).toString(),
    }
  );

  const refreshData = await refreshResponse.json();

  console.log(
    "HubSpot refresh response status:",
    refreshResponse.status
  );

  /*
  |--------------------------------------------------------------------------
  | REFRESH FAILED
  |--------------------------------------------------------------------------
  */
  if (!refreshResponse.ok) {
    console.error(
      "HubSpot token refresh failed:",
      refreshData
    );

    throw new Error(
      refreshData.error_description ||
        refreshData.message ||
        refreshData.error ||
        "Unable to refresh HubSpot access token."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VALIDATE NEW ACCESS TOKEN
  |--------------------------------------------------------------------------
  */
  if (!refreshData.access_token) {
    throw new Error(
      "HubSpot did not return a new access token."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | CALCULATE NEW EXPIRATION
  |--------------------------------------------------------------------------
  */
  const newExpiresAt = refreshData.expires_in
    ? new Date(
        Date.now() +
          Number(refreshData.expires_in) * 1000
      )
    : null;

  /*
  |--------------------------------------------------------------------------
  | SAVE NEW ACCESS TOKEN
  |--------------------------------------------------------------------------
  */
  integration.oauth.accessToken =
    refreshData.access_token;

  integration.oauth.expiresAt =
    newExpiresAt;

  /*
  |--------------------------------------------------------------------------
  | HUBSPOT MAY RETURN A NEW REFRESH TOKEN
  |--------------------------------------------------------------------------
  */
  if (refreshData.refresh_token) {
    integration.oauth.refreshToken =
      refreshData.refresh_token;
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE TOKEN TYPE
  |--------------------------------------------------------------------------
  */
  if (refreshData.token_type) {
    integration.oauth.tokenType =
      refreshData.token_type;
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE SCOPES
  |--------------------------------------------------------------------------
  */
  if (Array.isArray(refreshData.scopes)) {
    integration.oauth.scope =
      refreshData.scopes.join(" ");
  } else if (refreshData.scope) {
    integration.oauth.scope =
      refreshData.scope;
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE TO MONGODB
  |--------------------------------------------------------------------------
  */
  await integration.save();

  console.log(
    "HubSpot access token refreshed successfully."
  );

  console.log(
    "New token expiration:",
    newExpiresAt
  );

  console.log(
    "=========================================="
  );

  return refreshData.access_token;
};

/*
|--------------------------------------------------------------------------
| GET ALL INTEGRATIONS
|--------------------------------------------------------------------------
*/
const getIntegrations = async (req, res) => {
  try {
    const companyId = getCompanyId(req.user.companyId);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is missing.",
      });
    }

    const integrations = await Integration.find({
      companyId,
      isActive: true,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Integrations fetched successfully.",
      data: {
        integrations,
      },
    });
  } catch (error) {
    console.error(
      "Get Integrations Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch integrations.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET AVAILABLE INTEGRATIONS
|--------------------------------------------------------------------------
*/
const getAvailableIntegrations = async (req, res) => {
  try {
    const companyId = getCompanyId(req.user.companyId);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is missing.",
      });
    }

    const integrations = await Integration.find({
      companyId,
      category: "available",
      isActive: true,
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message:
        "Available integrations fetched successfully.",
      data: {
        integrations,
      },
    });
  } catch (error) {
    console.error(
      "Get Available Integrations Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch available integrations.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CONNECT INTEGRATION
|--------------------------------------------------------------------------
*/
const connectIntegration = async (req, res) => {
  try {
    const { key, config = {} } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Integration key is required.",
      });
    }

    const companyId = getCompanyId(
      req.user.companyId
    );

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is missing.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | HUBSPOT
    |--------------------------------------------------------------------------
    | HubSpot uses OAuth.
    |--------------------------------------------------------------------------
    */
    if (key.toLowerCase() === "hubspot") {
      const clientId =
        process.env.HUBSPOT_CLIENT_ID;

      const redirectUri =
        process.env.HUBSPOT_REDIRECT_URI;

      if (!clientId || !redirectUri) {
        return res.status(500).json({
          success: false,
          message:
            "HubSpot OAuth configuration is missing.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | OAUTH STATE
      |--------------------------------------------------------------------------
      */
      const statePayload = {
        companyId,

        userId: req.user._id
          ? req.user._id.toString()
          : req.user.id?.toString(),

        nonce: crypto
          .randomBytes(16)
          .toString("hex"),
      };

      const state = Buffer.from(
        JSON.stringify(statePayload)
      ).toString("base64url");

      /*
      |--------------------------------------------------------------------------
      | HUBSPOT SCOPES
      |--------------------------------------------------------------------------
      */
     const scopes = [
  "oauth",
  "crm.objects.contacts.read",
  "crm.objects.contacts.write",
  "crm.objects.deals.read",
];

      /*
      |--------------------------------------------------------------------------
      | HUBSPOT AUTHORIZATION URL
      |--------------------------------------------------------------------------
      */
      const authorizationUrl =
        "https://app.hubspot.com/oauth/authorize" +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(
          scopes.join(" ")
        )}` +
        `&state=${encodeURIComponent(state)}`;

      console.log(
        "HubSpot OAuth URL generated."
      );

      console.log(
        "OAuth companyId:",
        companyId
      );

      return res.status(200).json({
        success: true,
        message:
          "HubSpot authorization URL generated successfully.",
        data: {
          authorizationUrl,
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | EXISTING NON-OAUTH INTEGRATIONS
    |--------------------------------------------------------------------------
    */
    const integration =
      await Integration.findOne({
        companyId,
        key: key.toLowerCase(),
      });

    if (!integration) {
      return res.status(404).json({
        success: false,
        message: "Integration not found.",
      });
    }

    integration.status = "connected";
    integration.category = "connected";
    integration.config = config;
    integration.connectedAt = new Date();
    integration.disconnectedAt = null;

    await integration.save();

    return res.status(200).json({
      success: true,
      message:
        `${integration.name} connected successfully.`,
      data: {
        integration,
      },
    });
  } catch (error) {
    console.error(
      "Connect Integration Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to connect integration.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| HUBSPOT OAUTH CALLBACK
|--------------------------------------------------------------------------
*/
const hubspotOAuthCallback = async (req, res) => {
  try {
    const {
      code,
      state,
      error,
      error_description,
    } = req.query;

    console.log("");
    console.log("==========================================");
    console.log("      HUBSPOT OAUTH CALLBACK");
    console.log("==========================================");

    console.log(
      "Has code:",
      !!code
    );

    console.log(
      "Has state:",
      !!state
    );

    console.log(
      "HubSpot error:",
      error || "none"
    );

    console.log(
      "HubSpot error description:",
      error_description || "none"
    );

    /*
    |--------------------------------------------------------------------------
    | HUBSPOT DENIED AUTHORIZATION
    |--------------------------------------------------------------------------
    */
    if (error) {
      console.error(
        "HubSpot OAuth Error:",
        {
          error,
          error_description,
        }
      );

      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 40px;">
            <h2>HubSpot Connection Failed</h2>

            <p>
              <strong>Error:</strong>
              ${error}
            </p>

            <p>
              ${
                error_description ||
                "Authorization was denied."
              }
            </p>

            <p>
              You can close this window and try again.
            </p>
          </body>
        </html>
      `);
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE CODE + STATE
    |--------------------------------------------------------------------------
    */
    if (!code || !state) {
      console.error(
        "Missing OAuth code or state."
      );

      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 40px;">
            <h2>HubSpot Connection Failed</h2>

            <p>
              Authorization code or state is missing.
            </p>
          </body>
        </html>
      `);
    }

    /*
    |--------------------------------------------------------------------------
    | DECODE OAUTH STATE
    |--------------------------------------------------------------------------
    */
    let stateData;

    try {
      stateData = JSON.parse(
        Buffer.from(
          state,
          "base64url"
        ).toString("utf8")
      );

      console.log(
        "Decoded OAuth state:",
        {
          companyId:
            stateData.companyId,

          userId:
            stateData.userId,

          hasNonce:
            !!stateData.nonce,
        }
      );
    } catch (stateError) {
      console.error(
        "Invalid HubSpot OAuth State:",
        stateError
      );

      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 40px;">
            <h2>HubSpot Connection Failed</h2>

            <p>
              Invalid OAuth state.
            </p>
          </body>
        </html>
      `);
    }

    /*
    |--------------------------------------------------------------------------
    | NORMALIZE COMPANY ID FROM STATE
    |--------------------------------------------------------------------------
    */
    const companyId = getCompanyId(
      stateData.companyId
    );

    if (!companyId) {
      console.error(
        "Company ID missing from OAuth state."
      );

      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 40px;">
            <h2>HubSpot Connection Failed</h2>

            <p>
              Company information is missing.
            </p>
          </body>
        </html>
      `);
    }

    console.log(
      "Normalized companyId:",
      companyId
    );

    /*
    |--------------------------------------------------------------------------
    | CHECK ENVIRONMENT
    |--------------------------------------------------------------------------
    */
    console.log(
      "HubSpot OAuth configuration:",
      {
        hasClientId:
          !!process.env.HUBSPOT_CLIENT_ID,

        hasClientSecret:
          !!process.env.HUBSPOT_CLIENT_SECRET,

        redirectUri:
          process.env.HUBSPOT_REDIRECT_URI,
      }
    );

    if (
      !process.env.HUBSPOT_CLIENT_ID ||
      !process.env.HUBSPOT_CLIENT_SECRET ||
      !process.env.HUBSPOT_REDIRECT_URI
    ) {
      console.error(
        "HubSpot OAuth environment variables are missing."
      );

      return res.status(500).send(`
        <html>
          <body style="font-family: Arial; padding: 40px;">
            <h2>HubSpot Connection Failed</h2>

            <p>
              HubSpot OAuth environment configuration
              is incomplete.
            </p>

            <p>
              Please check the backend .env file.
            </p>
          </body>
        </html>
      `);
    }

    /*
    |--------------------------------------------------------------------------
    | EXCHANGE AUTHORIZATION CODE FOR TOKEN
    |--------------------------------------------------------------------------
    */
    console.log(
      "Starting HubSpot token exchange..."
    );

    const tokenResponse = await fetch(
      "https://api.hubapi.com/oauth/2026-03/token",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body: new URLSearchParams({
          grant_type:
            "authorization_code",

          client_id:
            process.env.HUBSPOT_CLIENT_ID,

          client_secret:
            process.env.HUBSPOT_CLIENT_SECRET,

          redirect_uri:
            process.env.HUBSPOT_REDIRECT_URI,

          code,
        }).toString(),
      }
    );

    const tokenData =
      await tokenResponse.json();

    console.log(
      "HubSpot token response status:",
      tokenResponse.status
    );

    /*
    |--------------------------------------------------------------------------
    | TOKEN EXCHANGE FAILED
    |--------------------------------------------------------------------------
    */
    if (!tokenResponse.ok) {
      console.error(
        "HubSpot Token Exchange Error:",
        tokenData
      );

      const tokenError =
        tokenData.error_description ||
        tokenData.message ||
        tokenData.error ||
        "Unknown HubSpot OAuth error.";

      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 40px;">
            <h2>HubSpot Connection Failed</h2>

            <p>
              <strong>
                Token exchange failed.
              </strong>
            </p>

            <p>
              ${tokenError}
            </p>

            <pre style="
              background:#f5f5f5;
              padding:15px;
              border-radius:8px;
              overflow:auto;
            ">${JSON.stringify(
              tokenData,
              null,
              2
            )}</pre>

            <p>
              You can close this window and try again.
            </p>
          </body>
        </html>
      `);
    }

    /*
    |--------------------------------------------------------------------------
    | TOKEN RECEIVED
    |--------------------------------------------------------------------------
    */
    console.log(
      "HubSpot token received successfully."
    );

    console.log(
      "Has access token:",
      !!tokenData.access_token
    );

    console.log(
      "Has refresh token:",
      !!tokenData.refresh_token
    );

    console.log(
      "Expires in:",
      tokenData.expires_in
    );

    /*
    |--------------------------------------------------------------------------
    | FETCH HUBSPOT ACCOUNT INFORMATION
    |--------------------------------------------------------------------------
    */
    let accountId = tokenData.hub_id
      ? String(tokenData.hub_id)
      : null;

    let accountName = "HubSpot";

    try {
      console.log(
        "Fetching HubSpot account information..."
      );

      const accountResponse =
        await fetch(
          "https://api.hubapi.com/account-info/v3/details",
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${tokenData.access_token}`,
            },
          }
        );

      const accountData =
        await accountResponse.json();

      console.log(
        "HubSpot account info status:",
        accountResponse.status
      );

      if (accountResponse.ok) {
        accountId =
          accountData.portalId
            ? String(
                accountData.portalId
              )
            : accountId;

        accountName =
          accountData.companyName ||
          accountData.accountName ||
          "HubSpot";

        console.log(
          "HubSpot account information:",
          {
            accountId,
            accountName,
          }
        );
      } else {
        console.error(
          "HubSpot Account Information Error:",
          accountData
        );
      }
    } catch (accountError) {
      console.error(
        "HubSpot Account Information Exception:",
        accountError
      );
    }

    /*
    |--------------------------------------------------------------------------
    | FIND BUSINESSFLOW HUBSPOT INTEGRATION
    |--------------------------------------------------------------------------
    */
    console.log(
      "Finding HubSpot integration for company:",
      companyId
    );

    const integration =
      await Integration.findOne({
        companyId,
        key: "hubspot",
      });

    if (!integration) {
      console.error(
        "HubSpot integration not found for company:",
        companyId
      );

      return res.status(404).send(`
        <html>
          <body style="font-family: Arial; padding: 40px;">
            <h2>HubSpot Connection Failed</h2>

            <p>
              HubSpot integration was not found
              for this BusinessFlow company.
            </p>

            <p>
              Please make sure the HubSpot integration
              seed has been run.
            </p>
          </body>
        </html>
      `);
    }

    console.log(
      "HubSpot integration found:",
      integration._id.toString()
    );

    /*
    |--------------------------------------------------------------------------
    | CALCULATE TOKEN EXPIRATION
    |--------------------------------------------------------------------------
    */
    const expiresAt = tokenData.expires_in
      ? new Date(
          Date.now() +
            Number(
              tokenData.expires_in
            ) * 1000
        )
      : null;

    /*
    |--------------------------------------------------------------------------
    | SAVE HUBSPOT CONNECTION
    |--------------------------------------------------------------------------
    */
    integration.status = "connected";

    integration.category = "connected";

    integration.connectedAt =
      new Date();

    integration.disconnectedAt =
      null;

    integration.oauth = {
      provider: "hubspot",

      accessToken:
        tokenData.access_token ||
        null,

      refreshToken:
        tokenData.refresh_token ||
        null,

      tokenType:
        tokenData.token_type ||
        "bearer",

      scope:
        Array.isArray(
          tokenData.scopes
        )
          ? tokenData.scopes.join(" ")
          : tokenData.scope ||
            null,

      expiresAt,

      accountId,

      accountName,
    };

    await integration.save();

    console.log(
      "HubSpot integration saved successfully."
    );

    console.log(
      "========== HUBSPOT CONNECTED =========="
    );

    /*
    |--------------------------------------------------------------------------
    | SUCCESS PAGE
    |--------------------------------------------------------------------------
    */
    return res.status(200).send(`
      <html>
        <head>
          <title>HubSpot Connected</title>
        </head>

        <body
          style="
            font-family: Arial, sans-serif;
            background: #f4f8ff;
            padding: 40px;
          "
        >
          <div
            style="
              max-width: 500px;
              margin: 80px auto;
              background: white;
              padding: 35px;
              border-radius: 16px;
              text-align: center;
              box-shadow:
                0 10px 30px rgba(0,0,0,0.08);
            "
          >
            <div
              style="
                width: 60px;
                height: 60px;
                margin: 0 auto 20px;
                border-radius: 50%;
                background: #e7f8ee;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
              "
            >
              ✓
            </div>

            <h2 style="color: #071d35;">
              HubSpot Connected Successfully
            </h2>

            <p style="color: #64748b;">
              Your HubSpot account has been connected
              to BusinessFlow AI.
            </p>

            <p style="color: #64748b;">
              HubSpot Account:
              ${accountId || "Connected"}
            </p>

            <p style="color: #64748b;">
              You can close this window and return
              to BusinessFlow AI.
            </p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(
      "========== HUBSPOT OAUTH CALLBACK ERROR =========="
    );

    console.error(
      "Error name:",
      error.name
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "Error stack:",
      error.stack
    );

    return res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 40px;">
          <h2>HubSpot Connection Failed</h2>

          <p>
            An unexpected error occurred while
            connecting HubSpot.
          </p>

          <p>
            <strong>Error:</strong>
            ${error.message}
          </p>

          <p>
            You can close this window and try again.
          </p>
        </body>
      </html>
    `);
  }
};

/*
|--------------------------------------------------------------------------
| GET HUBSPOT CONTACTS
|--------------------------------------------------------------------------
*/
const getHubSpotContacts = async (req, res) => {
  try {
    const companyId = getCompanyId(
      req.user.companyId
    );

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is missing.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | FIND CONNECTED HUBSPOT INTEGRATION
    |--------------------------------------------------------------------------
    */
    const integration =
      await Integration.findOne({
        companyId,
        key: "hubspot",
        status: "connected",
        isActive: true,
      });

    if (!integration) {
      return res.status(404).json({
        success: false,
        message:
          "HubSpot is not connected.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | GET VALID ACCESS TOKEN
    |--------------------------------------------------------------------------
    */
    const accessToken =
      await getHubSpotAccessToken(
        integration
      );

    /*
    |--------------------------------------------------------------------------
    | QUERY PARAMETERS
    |--------------------------------------------------------------------------
    */
    const requestedLimit =
      Number(req.query.limit) || 20;

    const limit = Math.min(
      Math.max(
        requestedLimit,
        1
      ),
      100
    );

    const after =
      req.query.after;

    /*
    |--------------------------------------------------------------------------
    | BUILD HUBSPOT CONTACTS URL
    |--------------------------------------------------------------------------
    */
    const url = new URL(
      "https://api.hubapi.com/crm/v3/objects/contacts"
    );

    url.searchParams.set(
      "limit",
      String(limit)
    );

    /*
    |--------------------------------------------------------------------------
    | CONTACT PROPERTIES
    |--------------------------------------------------------------------------
    */
    url.searchParams.set(
      "properties",
      [
        "firstname",
        "lastname",
        "email",
        "phone",
        "company",
        "jobtitle",
        "createdate",
        "lastmodifieddate",
      ].join(",")
    );

    if (after) {
      url.searchParams.set(
        "after",
        after
      );
    }

    console.log("");
    console.log(
      "=========================================="
    );
    console.log(
      "      HUBSPOT CONTACTS API"
    );
    console.log(
      "=========================================="
    );

    console.log(
      "Company ID:",
      companyId
    );

    console.log(
      "HubSpot Account ID:",
      integration.oauth?.accountId ||
        "unknown"
    );

    console.log(
      "Fetching HubSpot contacts..."
    );

    /*
    |--------------------------------------------------------------------------
    | CALL HUBSPOT CONTACTS API
    |--------------------------------------------------------------------------
    */
    const contactsResponse =
      await fetch(
        url.toString(),
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,

            Accept:
              "application/json",
          },
        }
      );

    const contactsData =
      await contactsResponse.json();

    console.log(
      "HubSpot contacts response status:",
      contactsResponse.status
    );

    /*
    |--------------------------------------------------------------------------
    | HUBSPOT API ERROR
    |--------------------------------------------------------------------------
    */
    if (!contactsResponse.ok) {
      console.error(
        "HubSpot Contacts API Error:",
        contactsData
      );

      return res.status(
        contactsResponse.status
      ).json({
        success: false,

        message:
          contactsData.message ||
          "Unable to fetch HubSpot contacts.",

        data:
          contactsData,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */
    console.log(
      "HubSpot contacts fetched successfully."
    );

    console.log(
      "Contacts count:",
      contactsData.results?.length || 0
    );

    return res.status(200).json({
      success: true,

      message:
        "HubSpot contacts fetched successfully.",

      data: {
        contacts:
          contactsData.results || [],

        paging:
          contactsData.paging || null,

        total:
          contactsData.total || null,
      },
    });
  } catch (error) {
    console.error(
      "Get HubSpot Contacts Error:",
      error
    );

    /*
    |--------------------------------------------------------------------------
    | REAUTHORIZATION ERROR
    |--------------------------------------------------------------------------
    */
    if (
      error.message
        ?.toLowerCase()
        .includes("reconnect hubspot")
    ) {
      return res.status(401).json({
        success: false,

        message:
          "HubSpot authorization has expired. Please reconnect HubSpot.",
      });
    }

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch HubSpot contacts.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE / CONFIGURE INTEGRATION
|--------------------------------------------------------------------------
*/
const updateIntegration = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { config } = req.body;

    const companyId =
      getCompanyId(
        req.user.companyId
      );

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is missing.",
      });
    }

    const integration =
      await Integration.findOne({
        _id: id,
        companyId,
      });

    if (!integration) {
      return res.status(404).json({
        success: false,
        message:
          "Integration not found.",
      });
    }

    if (config !== undefined) {
      integration.config =
        config;
    }

    await integration.save();

    return res.status(200).json({
      success: true,

      message:
        `${integration.name} configuration updated successfully.`,

      data: {
        integration,
      },
    });
  } catch (error) {
    console.error(
      "Update Integration Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update integration.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| DISCONNECT INTEGRATION
|--------------------------------------------------------------------------
*/
const disconnectIntegration = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const companyId =
      getCompanyId(
        req.user.companyId
      );

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is missing.",
      });
    }

    const integration =
      await Integration.findOne({
        _id: id,
        companyId,
      });

    if (!integration) {
      return res.status(404).json({
        success: false,
        message:
          "Integration not found.",
      });
    }

    integration.status =
      "disconnected";

    integration.category =
      "available";

    integration.disconnectedAt =
      new Date();

    integration.config = {};

    /*
    |--------------------------------------------------------------------------
    | CLEAR OAUTH TOKENS
    |--------------------------------------------------------------------------
    */
    integration.oauth = {
      provider:
        integration.oauth?.provider ||
        null,

      accessToken: null,

      refreshToken: null,

      tokenType: null,

      scope: null,

      expiresAt: null,

      accountId: null,

      accountName: null,
    };

    await integration.save();

    return res.status(200).json({
      success: true,

      message:
        `${integration.name} disconnected successfully.`,

      data: {
        integration,
      },
    });
  } catch (error) {
    console.error(
      "Disconnect Integration Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to disconnect integration.",
    });
  }
};

// =====================================================
// SYNC HUBSPOT CONTACTS TO BUSINESSFLOW LEADS
// =====================================================
// POST /api/integrations/hubspot/sync-leads
// =====================================================

const syncHubSpotContactsToLeads = async (req, res) => {
  try {
    // =================================================
    // COMPANY
    // =================================================

    const companyId = getCompanyId(
      req.user.companyId
    );

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is missing.",
      });
    }

    // =================================================
    // FIND CONNECTED HUBSPOT
    // =================================================

    const integration = await Integration.findOne({
      companyId,
      key: "hubspot",
      status: "connected",
      isActive: true,
    });

    if (!integration) {
      return res.status(404).json({
        success: false,
        message: "HubSpot is not connected.",
      });
    }

    // =================================================
    // GET VALID ACCESS TOKEN
    // =================================================

    const accessToken =
      await getHubSpotAccessToken(
        integration
      );

    // =================================================
    // FETCH HUBSPOT CONTACTS
    // =================================================

    const url = new URL(
      "https://api.hubapi.com/crm/v3/objects/contacts"
    );

    url.searchParams.set(
      "limit",
      "100"
    );

    url.searchParams.set(
      "properties",
      [
        "firstname",
        "lastname",
        "email",
        "phone",
        "company",
        "jobtitle",
        "createdate",
        "lastmodifieddate",
      ].join(",")
    );

    console.log("");
    console.log(
      "=========================================="
    );
    console.log(
      "   HUBSPOT → BUSINESSFLOW LEAD SYNC"
    );
    console.log(
      "=========================================="
    );

    console.log(
      "Company ID:",
      companyId
    );

    console.log(
      "HubSpot Account:",
      integration.oauth?.accountId ||
        "unknown"
    );

    console.log(
      "Fetching HubSpot contacts..."
    );

    const contactsResponse =
      await fetch(
        url.toString(),
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,

            Accept:
              "application/json",
          },
        }
      );

    const contactsData =
      await contactsResponse.json();

    console.log(
      "HubSpot response:",
      contactsResponse.status
    );

    // =================================================
    // HUBSPOT ERROR
    // =================================================

    if (!contactsResponse.ok) {
      console.error(
        "HubSpot Contacts API Error:",
        contactsData
      );

      return res.status(
        contactsResponse.status
      ).json({
        success: false,
        message:
          contactsData.message ||
          "Unable to fetch HubSpot contacts.",
      });
    }

    const contacts =
      contactsData.results || [];

    // =================================================
    // SYNC COUNTERS
    // =================================================

    let created = 0;
    let updated = 0;
    let skipped = 0;

    const errors = [];

    // =================================================
    // PROCESS EACH CONTACT
    // =================================================

    for (const contact of contacts) {
      try {
        const properties =
          contact.properties || {};

        const hubspotContactId =
          contact.id
            ? String(contact.id)
            : null;

        const firstName =
          properties.firstname?.trim() || "";

        const lastName =
          properties.lastname?.trim() || "";

        const email =
          properties.email
            ?.trim()
            .toLowerCase() || "";

        const phone =
          properties.phone?.trim() || null;

        const company =
          properties.company?.trim() || null;

        const jobTitle =
          properties.jobtitle?.trim() || null;

        // =================================================
        // HUBSPOT ID REQUIRED
        // =================================================

        if (!hubspotContactId) {
          skipped++;

          errors.push({
            contactId: null,
            reason:
              "HubSpot contact ID is missing.",
          });

          continue;
        }

        // =================================================
        // EMAIL REQUIRED BY BUSINESSFLOW LEAD MODEL
        // =================================================

        if (!email) {
          skipped++;

          errors.push({
            contactId:
              hubspotContactId,

            reason:
              "Contact skipped because email is missing.",
          });

          continue;
        }

        // =================================================
        // FIRST NAME
        // =================================================

        const safeFirstName =
          firstName || "Unknown";

        // =================================================
        // LAST NAME
        // =================================================

        const safeLastName =
          lastName || "Contact";

        // =================================================
        // FIND EXISTING HUBSPOT LEAD
        // =================================================

        let lead =
          await Lead.findOne({
            companyId,
            hubspotContactId,
          });

        // =================================================
        // CREATE NEW LEAD
        // =================================================

        if (!lead) {
          lead = await Lead.create({
            companyId,

            firstName:
              safeFirstName,

            lastName:
              safeLastName,

            email,

            phone,

            company,

            jobTitle,

            value: 0,

            status: "New",

            source: "HubSpot",

            assignedTo: null,

            notes: null,

            lastActivityAt:
              new Date(),

            hubspotContactId,
          });

          created++;

          console.log(
            `Created Lead: ${safeFirstName} ${safeLastName}`
          );

          continue;
        }

        // =================================================
        // UPDATE EXISTING LEAD
        // =================================================

        lead.firstName =
          safeFirstName;

        lead.lastName =
          safeLastName;

        lead.email =
          email;

        lead.phone =
          phone;

        lead.company =
          company;

        lead.jobTitle =
          jobTitle;

        // Do NOT reset:
        // status
        // value
        // assignedTo
        // notes

        lead.lastActivityAt =
          new Date();

        await lead.save();

        updated++;

        console.log(
          `Updated Lead: ${safeFirstName} ${safeLastName}`
        );
      } catch (contactError) {
        console.error(
          "HubSpot contact sync error:",
          contactError
        );

        skipped++;

        errors.push({
          contactId:
            contact?.id || null,

          reason:
            contactError.message ||
            "Unable to sync contact.",
        });
      }
    }

    // =================================================
    // FINAL RESPONSE
    // =================================================

    console.log(
      "=========================================="
    );

    console.log(
      "HubSpot sync completed."
    );

    console.log(
      "Created:",
      created
    );

    console.log(
      "Updated:",
      updated
    );

    console.log(
      "Skipped:",
      skipped
    );

    console.log(
      "=========================================="
    );

    return res.status(200).json({
      success: true,

      message:
        "HubSpot contacts synced to BusinessFlow leads successfully.",

      data: {
        totalContacts:
          contacts.length,

        created,

        updated,

        skipped,

        errors,
      },
    });
  } catch (error) {
    console.error(
      "Sync HubSpot Contacts To Leads Error:",
      error
    );

    if (
      error.message
        ?.toLowerCase()
        .includes("reconnect hubspot")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "HubSpot authorization has expired. Please reconnect HubSpot.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to sync HubSpot contacts to leads.",
    });
  }
};


// =====================================================
// GET HUBSPOT DEALS
// =====================================================
// GET /api/integrations/hubspot/deals
// =====================================================

const getHubSpotDeals = async (req, res) => {
  try {
    // =================================================
    // COMPANY
    // =================================================

    const companyId = getCompanyId(
      req.user.companyId
    );

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is missing.",
      });
    }

    // =================================================
    // FIND CONNECTED HUBSPOT
    // =================================================

    const integration = await Integration.findOne({
      companyId,
      key: "hubspot",
      status: "connected",
      isActive: true,
    });

    if (!integration) {
      return res.status(404).json({
        success: false,
        message: "HubSpot is not connected.",
      });
    }

    // =================================================
    // GET VALID ACCESS TOKEN
    // =================================================

    const accessToken =
      await getHubSpotAccessToken(integration);

    // =================================================
    // QUERY PARAMETERS
    // =================================================

    const requestedLimit =
      Number(req.query.limit) || 50;

    const limit = Math.min(
      Math.max(requestedLimit, 1),
      100
    );

    const after = req.query.after || "";

    // =================================================
    // HUBSPOT DEALS URL
    // =================================================

    const url = new URL(
      "https://api.hubapi.com/crm/v3/objects/deals"
    );

    url.searchParams.set(
      "limit",
      String(limit)
    );

    url.searchParams.set(
      "properties",
      [
        "dealname",
        "amount",
        "dealstage",
        "pipeline",
        "closedate",
        "createdate",
        "hs_lastmodifieddate",
        "hubspot_owner_id",
        "dealtype",
        "description",
      ].join(",")
    );

    if (after) {
      url.searchParams.set(
        "after",
        after
      );
    }

    // =================================================
    // FETCH DEALS FROM HUBSPOT
    // =================================================

    console.log("");
    console.log(
      "=========================================="
    );
    console.log(
      "        HUBSPOT DEALS API"
    );
    console.log(
      "=========================================="
    );

    console.log(
      "BusinessFlow Company:",
      companyId
    );

    console.log(
      "HubSpot Account:",
      integration.oauth?.accountId ||
        "unknown"
    );

    console.log(
      "Fetching HubSpot deals..."
    );

    const dealsResponse = await fetch(
      url.toString(),
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          Accept:
            "application/json",
        },
      }
    );

    const dealsData =
      await dealsResponse.json();

    console.log(
      "HubSpot deals response:",
      dealsResponse.status
    );

    // =================================================
    // HUBSPOT ERROR
    // =================================================

    if (!dealsResponse.ok) {
      console.error(
        "HubSpot Deals API Error:",
        dealsData
      );

      return res.status(
        dealsResponse.status
      ).json({
        success: false,

        message:
          dealsData.message ||
          "Unable to fetch HubSpot deals.",

        data: dealsData,
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    const deals =
      dealsData.results || [];

    console.log(
      "HubSpot deals fetched:",
      deals.length
    );

    return res.status(200).json({
      success: true,

      message:
        "HubSpot deals fetched successfully.",

      data: {
        deals,

        paging:
          dealsData.paging || null,

        total:
          dealsData.total || null,
      },
    });
  } catch (error) {
    console.error(
      "Get HubSpot Deals Error:",
      error
    );

    if (
      error.message
        ?.toLowerCase()
        .includes("reconnect hubspot")
    ) {
      return res.status(401).json({
        success: false,

        message:
          "HubSpot authorization has expired. Please reconnect HubSpot.",
      });
    }

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch HubSpot deals.",
    });
  }
};
/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/
module.exports = {
  getIntegrations,
  getAvailableIntegrations,
  connectIntegration,
  hubspotOAuthCallback,
  getHubSpotContacts,
  getHubSpotDeals,
  syncHubSpotContactsToLeads,
  updateIntegration,
  disconnectIntegration,
};