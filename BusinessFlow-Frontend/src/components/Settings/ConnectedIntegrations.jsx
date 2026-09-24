import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  MessageSquare,
  CalendarDays,
  X,
  CreditCard,
  Mail,
  Database,
  RefreshCw,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";
import api from "../../services/api";

// =====================================================
// SUPPORTED INTEGRATIONS
// =====================================================

const SUPPORTED_INTEGRATIONS = [
  "hubspot",
  "slack",
  "google_workspace",
  "google_calendar",
  "stripe",
];

// =====================================================
// ICON MAPPING
// =====================================================

const iconMap = {
  hubspot: Database,
  slack: MessageSquare,
  google_workspace: Mail,
  google_calendar: CalendarDays,
  stripe: CreditCard,
};

// =====================================================
// DEFAULT CONFIG
// =====================================================

const getDefaultConfig = (integration) => {
  const existingConfig =
    integration?.config || {};

  return {
    workspaceName:
      existingConfig.workspaceName || "",

    accountEmail:
      existingConfig.accountEmail || "",

    notifications:
      existingConfig.notifications ?? true,

    leadNotifications:
      existingConfig.leadNotifications ?? true,

    dealNotifications:
      existingConfig.dealNotifications ?? true,

    teamNotifications:
      existingConfig.teamNotifications ?? true,
  };
};

// =====================================================
// HUBSPOT CONTACT DISPLAY HELPERS
// =====================================================

const getContactName = (contact) => {
  const firstName =
    contact?.properties?.firstname || "";

  const lastName =
    contact?.properties?.lastname || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    contact?.properties?.email ||
    "Unnamed Contact"
  );
};

const getContactEmail = (contact) => {
  return (
    contact?.properties?.email ||
    "No email"
  );
};

const getContactPhone = (contact) => {
  return (
    contact?.properties?.phone ||
    ""
  );
};

const getContactCompany = (contact) => {
  return (
    contact?.properties?.company ||
    ""
  );
};

const getContactJobTitle = (contact) => {
  return (
    contact?.properties?.jobtitle ||
    ""
  );
};

// =====================================================
// COMPONENT
// =====================================================

const ConnectedIntegrations = () => {
  const [integrations, setIntegrations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  // ===================================================
  // CONFIGURE MODAL
  // ===================================================

  const [
    selectedIntegration,
    setSelectedIntegration,
  ] = useState(null);

  const [config, setConfig] =
    useState(getDefaultConfig(null));

  const [configSaving, setConfigSaving] =
    useState(false);

  const [configError, setConfigError] =
    useState("");

  const [configSuccess, setConfigSuccess] =
    useState("");

  // ===================================================
  // HUBSPOT CONTACTS
  // ===================================================

  const [hubSpotContacts, setHubSpotContacts] =
    useState([]);

  const [
    hubSpotContactsLoading,
    setHubSpotContactsLoading,
  ] = useState(false);

  const [
    hubSpotContactsError,
    setHubSpotContactsError,
  ] = useState("");

  const [
    hubSpotContactsLoaded,
    setHubSpotContactsLoaded,
  ] = useState(false);

  const [
    hubSpotNextAfter,
    setHubSpotNextAfter,
  ] = useState(null);

  const [
    hubSpotPreviousAfter,
    setHubSpotPreviousAfter,
  ] = useState(null);

  // ===================================================
  // API HELPERS
  // ===================================================

  const fetchIntegrations =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await api("/integrations");

        const allIntegrations =
          result.data?.integrations || [];

        /*
        |--------------------------------------------------------------------------
        | ONLY SUPPORTED INTEGRATIONS
        |--------------------------------------------------------------------------
        */

        const supportedIntegrations =
          allIntegrations.filter(
            (integration) =>
              SUPPORTED_INTEGRATIONS.includes(
                integration.key?.toLowerCase()
              )
          );

        setIntegrations(
          supportedIntegrations
        );
      } catch (error) {
        console.error(
          "Fetch Connected Integrations Error:",
          error
        );

        setError(
          error.message ||
            "Unable to load integrations."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // ===================================================
  // FETCH HUBSPOT CONTACTS
  // ===================================================

  const fetchHubSpotContacts =
    useCallback(
      async ({
        after = null,
        reset = false,
      } = {}) => {
        try {
          setHubSpotContactsLoading(
            true
          );

          setHubSpotContactsError("");

          if (reset) {
            setHubSpotContacts([]);
            setHubSpotNextAfter(null);
            setHubSpotPreviousAfter(null);
          }

          let endpoint =
            "/integrations/hubspot/contacts?limit=20";

          if (after) {
            endpoint += `&after=${encodeURIComponent(
              after
            )}`;
          }

          const result =
            await api(endpoint);

          const contacts =
            result.data?.contacts || [];

          const paging =
            result.data?.paging || null;

          setHubSpotContacts(
            contacts
          );

          setHubSpotNextAfter(
            paging?.next?.after || null
          );

          setHubSpotPreviousAfter(
            paging?.prev?.after || null
          );

          setHubSpotContactsLoaded(
            true
          );
        } catch (error) {
          console.error(
            "Fetch HubSpot Contacts Error:",
            error
          );

          setHubSpotContactsError(
            error.message ||
              "Unable to fetch HubSpot contacts."
          );

          setHubSpotContactsLoaded(
            false
          );
        } finally {
          setHubSpotContactsLoading(
            false
          );
        }
      },
      []
    );

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchIntegrations();

    const handleIntegrationUpdate =
      () => {
        fetchIntegrations();
      };

    window.addEventListener(
      "businessflow-integration-updated",
      handleIntegrationUpdate
    );

    return () => {
      window.removeEventListener(
        "businessflow-integration-updated",
        handleIntegrationUpdate
      );
    };
  }, [fetchIntegrations]);

  // ===================================================
  // CONNECT
  // ===================================================

  const handleConnect = async (
    integration
  ) => {
    try {
      setActionLoading(
        `connect-${integration._id}`
      );

      setError("");

      const result =
        await api(
          "/integrations/connect",
          {
            method: "POST",

            body: JSON.stringify({
              key: integration.key,
            }),
          }
        );

      /*
      |--------------------------------------------------------------------------
      | OAUTH INTEGRATION
      |--------------------------------------------------------------------------
      */

      if (
        result.data?.authorizationUrl
      ) {
        window.location.href =
          result.data.authorizationUrl;

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | NORMAL INTEGRATION
      |--------------------------------------------------------------------------
      */

      const updatedIntegration =
        result.data?.integration;

      if (updatedIntegration) {
        setIntegrations(
          (current) =>
            current.map((item) =>
              item._id ===
              integration._id
                ? updatedIntegration
                : item
            )
        );
      } else {
        await fetchIntegrations();
      }

      window.dispatchEvent(
        new CustomEvent(
          "businessflow-integration-updated"
        )
      );
    } catch (error) {
      console.error(
        "Connect Integration Error:",
        error
      );

      setError(
        error.message ||
          "Unable to connect integration."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ===================================================
  // OPEN CONFIGURE
  // ===================================================

  const handleConfigure = (
    integration
  ) => {
    if (
      integration.status !==
      "connected"
    ) {
      return;
    }

    setSelectedIntegration(
      integration
    );

    setConfig(
      getDefaultConfig(integration)
    );

    setConfigError("");
    setConfigSuccess("");

    /*
    |--------------------------------------------------------------------------
    | RESET HUBSPOT CONTACTS
    |--------------------------------------------------------------------------
    */

    setHubSpotContacts([]);
    setHubSpotContactsError("");
    setHubSpotContactsLoaded(false);
    setHubSpotNextAfter(null);
    setHubSpotPreviousAfter(null);
  };

  // ===================================================
  // CLOSE CONFIGURE
  // ===================================================

  const handleCloseConfigure = () => {
    if (configSaving) {
      return;
    }

    setSelectedIntegration(null);

    setConfigError("");
    setConfigSuccess("");

    setHubSpotContacts([]);
    setHubSpotContactsError("");
    setHubSpotContactsLoaded(false);
    setHubSpotNextAfter(null);
    setHubSpotPreviousAfter(null);
  };

  // ===================================================
  // CONFIG INPUT CHANGE
  // ===================================================

  const handleConfigChange = (
    field,
    value
  ) => {
    setConfig((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ===================================================
  // SAVE CONFIGURATION
  // ===================================================

  const handleSaveConfiguration =
    async () => {
      if (!selectedIntegration) {
        return;
      }

      try {
        setConfigSaving(true);
        setConfigError("");
        setConfigSuccess("");

        const result =
          await api(
            `/integrations/${selectedIntegration._id}`,
            {
              method: "PATCH",

              body: JSON.stringify({
                config,
              }),
            }
          );

        setIntegrations(
          (current) =>
            current.map((item) =>
              item._id ===
              selectedIntegration._id
                ? {
                    ...item,

                    config:
                      result.data
                        ?.integration
                        ?.config ||
                      config,
                  }
                : item
            )
        );

        setConfigSuccess(
          "Configuration saved successfully."
        );

        window.dispatchEvent(
          new CustomEvent(
            "businessflow-integration-updated"
          )
        );

        setTimeout(() => {
          setSelectedIntegration(
            null
          );

          setConfigSuccess("");
        }, 800);
      } catch (error) {
        console.error(
          "Save Integration Configuration Error:",
          error
        );

        setConfigError(
          error.message ||
            "Unable to save configuration."
        );
      } finally {
        setConfigSaving(false);
      }
    };

  // ===================================================
  // DISCONNECT
  // ===================================================

  const handleDisconnect =
    async (integration) => {
      try {
        setActionLoading(
          `disconnect-${integration._id}`
        );

        setError("");

        const result =
          await api(
            `/integrations/${integration._id}`,
            {
              method: "DELETE",
            }
          );

        if (
          result.data?.integration
        ) {
          setIntegrations(
            (current) =>
              current.map((item) =>
                item._id ===
                integration._id
                  ? result.data
                      .integration
                  : item
              )
          );
        } else {
          await fetchIntegrations();
        }

        window.dispatchEvent(
          new CustomEvent(
            "businessflow-integration-updated"
          )
        );
      } catch (error) {
        console.error(
          "Disconnect Integration Error:",
          error
        );

        setError(
          error.message ||
            "Unable to disconnect integration."
        );
      } finally {
        setActionLoading(null);
      }
    };

  // ===================================================
  // LOAD HUBSPOT CONTACTS
  // ===================================================

  const handleLoadHubSpotContacts =
    () => {
      fetchHubSpotContacts({
        reset: true,
      });
    };

  // ===================================================
  // NEXT HUBSPOT CONTACTS PAGE
  // ===================================================

  const handleNextHubSpotContacts =
    () => {
      if (
        !hubSpotNextAfter ||
        hubSpotContactsLoading
      ) {
        return;
      }

      fetchHubSpotContacts({
        after:
          hubSpotNextAfter,
      });
    };

  // ===================================================
  // PREVIOUS HUBSPOT CONTACTS PAGE
  // ===================================================

  const handlePreviousHubSpotContacts =
    () => {
      if (
        !hubSpotPreviousAfter ||
        hubSpotContactsLoading
      ) {
        return;
      }

      fetchHubSpotContacts({
        after:
          hubSpotPreviousAfter,
      });
    };

  // ===================================================
  // LOADING STATE
  // ===================================================

  if (loading) {
    return (
      <Card className="w-full overflow-hidden">
        <div className="flex h-[50px] items-center border-b border-[#DCE5ED] px-[18px]">
          <h2 className="text-[14px] font-bold text-[#102F4A]">
            Connected Integrations
          </h2>
        </div>

        <div className="flex min-h-[100px] items-center justify-center">
          <p className="text-[9px] text-[#718599]">
            Loading integrations...
          </p>
        </div>
      </Card>
    );
  }

  // ===================================================
  // ERROR STATE
  // ===================================================

  if (
    error &&
    integrations.length === 0
  ) {
    return (
      <Card className="w-full overflow-hidden">
        <div className="flex h-[50px] items-center border-b border-[#DCE5ED] px-[18px]">
          <h2 className="text-[14px] font-bold text-[#102F4A]">
            Connected Integrations
          </h2>
        </div>

        <div className="flex min-h-[100px] items-center justify-center px-[18px]">
          <p className="text-[9px] text-[#EF4444]">
            {error}
          </p>
        </div>
      </Card>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <>
      <Card className="w-full overflow-hidden">
        {/* Header */}

        <div className="flex h-[50px] items-center border-b border-[#DCE5ED] px-[18px]">
          <h2 className="text-[14px] font-bold text-[#102F4A]">
            Connected Integrations
          </h2>
        </div>

        {/* Error */}

        {error && (
          <div className="border-b border-[#DCE5ED] px-[18px] py-2">
            <p className="text-[9px] text-[#EF4444]">
              {error}
            </p>
          </div>
        )}

        {/* Integration Rows */}

        <div>
          {integrations.map(
            (
              integration,
              index
            ) => {
              const integrationKey =
                integration.key?.toLowerCase();

              const Icon =
                iconMap[
                  integrationKey
                ] || MessageSquare;

              const isConnecting =
                actionLoading ===
                `connect-${integration._id}`;

              const isDisconnecting =
                actionLoading ===
                `disconnect-${integration._id}`;

              const isConnected =
                integration.status ===
                "connected";

              const isPending =
                integration.status ===
                "pending";

              return (
                <div
                  key={
                    integration._id
                  }
                  className={`
                    flex
                    min-h-[78px]
                    items-center
                    justify-between
                    gap-4
                    px-[18px]
                    py-[12px]
                    ${
                      index !==
                      integrations.length - 1
                        ? "border-b border-[#DCE5ED]"
                        : ""
                    }
                  `}
                >
                  {/* Left */}

                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`
                        flex
                        h-[38px]
                        w-[38px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-[7px]
                        border
                        border-[#DCE5ED]
                        bg-[#F8FAFC]
                        ${
                          integrationKey ===
                          "hubspot"
                            ? "text-[#FF7A59]"
                            : integrationKey ===
                                "stripe"
                              ? "text-[#635BFF]"
                              : integrationKey ===
                                  "google_calendar"
                                ? "text-[#4285F4]"
                                : integrationKey ===
                                    "google_workspace"
                                  ? "text-[#4285F4]"
                                  : integrationKey ===
                                      "slack"
                                    ? "text-[#611F69]"
                                    : "text-[#315D80]"
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[10px] font-bold text-[#17324D]">
                          {
                            integration.name
                          }
                        </h3>

                        {/* STATUS */}

                        {isConnected ? (
                          <span
                            className="
                              rounded-[4px]
                              bg-[#E8F8EF]
                              px-[6px]
                              py-[2px]
                              text-[7px]
                              font-semibold
                              text-[#20A65A]
                            "
                          >
                            Connected
                          </span>
                        ) : isPending ? (
                          <span
                            className="
                              rounded-[4px]
                              bg-[#FFF7E6]
                              px-[6px]
                              py-[2px]
                              text-[7px]
                              font-semibold
                              text-[#C98200]
                            "
                          >
                            Connecting
                          </span>
                        ) : (
                          <span
                            className="
                              rounded-[4px]
                              bg-[#F1F5F9]
                              px-[6px]
                              py-[2px]
                              text-[7px]
                              font-semibold
                              text-[#718599]
                            "
                          >
                            Disconnected
                          </span>
                        )}
                      </div>

                      <p className="mt-1 max-w-[430px] text-[9px] leading-[13px] text-[#718599]">
                        {
                          integration.description
                        }
                      </p>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="flex shrink-0 items-center gap-1.5">
                    {/* CONNECTED */}

                    {isConnected && (
                      <>
                        <Button
                          variant="secondary"
                          className="
                            h-[24px]
                            rounded-[5px]
                            border-[#D8E2EA]
                            bg-[#EEF4FC]
                            px-2
                            text-[7px]
                            font-semibold
                            text-[#29465F]
                            leading-none
                          "
                          onClick={() =>
                            handleConfigure(
                              integration
                            )
                          }
                        >
                          Configure
                        </Button>

                        <Button
                          variant="secondary"
                          className="
                            h-[24px]
                            rounded-[5px]
                            border-[#FFD5D5]
                            bg-white
                            px-2
                            text-[7px]
                            font-semibold
                            text-[#EF4444]
                            leading-none
                            hover:bg-[#FFF7F7]
                          "
                          onClick={() =>
                            handleDisconnect(
                              integration
                            )
                          }
                          disabled={
                            isDisconnecting
                          }
                        >
                          {isDisconnecting
                            ? "..."
                            : "Disconnect"}
                        </Button>
                      </>
                    )}

                    {/* DISCONNECTED */}

                    {!isConnected &&
                      !isPending && (
                        <Button
                          variant="secondary"
                          className="
                            h-[24px]
                            rounded-[5px]
                            border-[#D8E2EA]
                            bg-[#EEF4FC]
                            px-2
                            text-[7px]
                            font-semibold
                            text-[#29465F]
                            leading-none
                          "
                          onClick={() =>
                            handleConnect(
                              integration
                            )
                          }
                          disabled={
                            isConnecting
                          }
                        >
                          {isConnecting
                            ? "Connecting..."
                            : "Connect"}
                        </Button>
                      )}

                    {/* PENDING */}

                    {isPending && (
                      <Button
                        variant="secondary"
                        className="
                          h-[24px]
                          rounded-[5px]
                          border-[#D8E2EA]
                          bg-[#F8FAFC]
                          px-2
                          text-[7px]
                          font-semibold
                          text-[#718599]
                          leading-none
                        "
                        disabled
                      >
                        Connecting...
                      </Button>
                    )}
                  </div>
                </div>
              );
            }
          )}

          {/* Empty */}

          {integrations.length ===
            0 && (
            <div className="flex min-h-[90px] items-center justify-center">
              <p className="text-[9px] text-[#718599]">
                No connected integrations
                found.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* =================================================
          CONFIGURATION MODAL
      ================================================= */}

      {selectedIntegration && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-[#102F4A]/20
            px-4
          "
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              handleCloseConfigure();
            }
          }}
        >
          <div
            className="
              max-h-[90vh]
              w-full
              max-w-[500px]
              overflow-hidden
              rounded-[10px]
              border
              border-[#DCE5ED]
              bg-white
              shadow-[0_15px_45px_rgba(16,47,74,0.15)]
            "
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#DCE5ED]
                px-4
                py-3
              "
            >
              <div>
                <h2 className="text-[13px] font-bold text-[#102F4A]">
                  Configure{" "}
                  {
                    selectedIntegration.name
                  }
                </h2>

                <p className="mt-1 text-[8px] text-[#718599]">
                  Manage integration
                  settings.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseConfigure
                }
                disabled={configSaving}
                className="
                  flex
                  h-[26px]
                  w-[26px]
                  items-center
                  justify-center
                  rounded-[5px]
                  text-[#718599]
                  hover:bg-[#F5F8FB]
                  hover:text-[#17324D]
                  disabled:cursor-not-allowed
                "
              >
                <X
                  size={15}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {/* =================================================
                HUBSPOT CONFIGURATION
            ================================================= */}

            {selectedIntegration.key?.toLowerCase() ===
            "hubspot" ? (
              <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
                <div className="space-y-4 px-4 py-4">
                  {/* HubSpot Account */}

                  <div
                    className="
                      rounded-[8px]
                      border
                      border-[#DCE5ED]
                      bg-[#F8FAFC]
                      p-3
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-[38px]
                          w-[38px]
                          shrink-0
                          items-center
                          justify-center
                          rounded-[7px]
                          border
                          border-[#FFD6CB]
                          bg-[#FFF4F0]
                          text-[#FF7A59]
                        "
                      >
                        <Database
                          size={18}
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#17324D]">
                          HubSpot Account
                        </p>

                        <p className="mt-1 text-[8px] text-[#718599]">
                          {selectedIntegration
                            .oauth
                            ?.accountName ||
                            "HubSpot"}
                        </p>

                        {selectedIntegration
                          .oauth
                          ?.accountId && (
                          <p className="mt-0.5 text-[7px] text-[#9AA8B5]">
                            Account ID:{" "}
                            {
                              selectedIntegration
                                .oauth
                                .accountId
                            }
                          </p>
                        )}
                      </div>

                      <span
                        className="
                          ml-auto
                          shrink-0
                          rounded-[4px]
                          bg-[#E8F8EF]
                          px-[6px]
                          py-[3px]
                          text-[7px]
                          font-semibold
                          text-[#20A65A]
                        "
                      >
                        Connected
                      </span>
                    </div>
                  </div>

                  {/* Contacts Header */}

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users
                          size={14}
                          strokeWidth={1.8}
                          className="text-[#315D80]"
                        />

                        <div>
                          <p className="text-[10px] font-bold text-[#17324D]">
                            CRM Contacts
                          </p>

                          <p className="mt-0.5 text-[7px] text-[#718599]">
                            Fetch contacts directly
                            from your HubSpot CRM.
                          </p>
                        </div>
                      </div>

                      {hubSpotContactsLoaded && (
                        <span className="text-[7px] text-[#718599]">
                          {
                            hubSpotContacts.length
                          }{" "}
                          loaded
                        </span>
                      )}
                    </div>

                    {/* Load Contacts Button */}

                    <button
                      type="button"
                      onClick={
                        handleLoadHubSpotContacts
                      }
                      disabled={
                        hubSpotContactsLoading
                      }
                      className="
                        flex
                        h-[30px]
                        w-full
                        items-center
                        justify-center
                        gap-1.5
                        rounded-[6px]
                        bg-[#123F63]
                        px-3
                        text-[8px]
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#0E3453]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {hubSpotContactsLoading ? (
                        <>
                          <RefreshCw
                            size={11}
                            className="animate-spin"
                          />

                          Loading Contacts...
                        </>
                      ) : (
                        <>
                          <RefreshCw
                            size={11}
                          />

                          {hubSpotContactsLoaded
                            ? "Refresh Contacts"
                            : "Load Contacts"}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Contacts Error */}

                  {hubSpotContactsError && (
                    <div
                      className="
                        rounded-[6px]
                        border
                        border-[#FFD5D5]
                        bg-[#FFF5F5]
                        px-3
                        py-2.5
                      "
                    >
                      <p className="text-[8px] font-semibold text-[#EF4444]">
                        {hubSpotContactsError}
                      </p>

                      <p className="mt-1 text-[7px] leading-[11px] text-[#A35A5A]">
                        If HubSpot authorization has
                        expired, reconnect the HubSpot
                        integration and try again.
                      </p>
                    </div>
                  )}

                  {/* Contacts List */}

                  {hubSpotContactsLoaded &&
                    !hubSpotContactsLoading && (
                      <div>
                        {hubSpotContacts.length >
                        0 ? (
                          <div
                            className="
                              overflow-hidden
                              rounded-[7px]
                              border
                              border-[#DCE5ED]
                            "
                          >
                            {/* Table Header */}

                            <div
                              className="
                                grid
                                grid-cols-[1.3fr_1.4fr_1fr]
                                gap-2
                                border-b
                                border-[#DCE5ED]
                                bg-[#F8FAFC]
                                px-3
                                py-2
                              "
                            >
                              <p className="text-[7px] font-bold uppercase tracking-wide text-[#718599]">
                                Contact
                              </p>

                              <p className="text-[7px] font-bold uppercase tracking-wide text-[#718599]">
                                Email
                              </p>

                              <p className="text-[7px] font-bold uppercase tracking-wide text-[#718599]">
                                Company
                              </p>
                            </div>

                            {/* Contact Rows */}

                            <div>
                              {hubSpotContacts.map(
                                (
                                  contact,
                                  index
                                ) => {
                                  const name =
                                    getContactName(
                                      contact
                                    );

                                  const email =
                                    getContactEmail(
                                      contact
                                    );

                                  const phone =
                                    getContactPhone(
                                      contact
                                    );

                                  const company =
                                    getContactCompany(
                                      contact
                                    );

                                  const jobTitle =
                                    getContactJobTitle(
                                      contact
                                    );

                                  return (
                                    <div
                                      key={
                                        contact.id ||
                                        index
                                      }
                                      className="
                                        grid
                                        grid-cols-[1.3fr_1.4fr_1fr]
                                        gap-2
                                        border-b
                                        border-[#EDF1F5]
                                        px-3
                                        py-2.5
                                        last:border-b-0
                                      "
                                    >
                                      {/* Contact */}

                                      <div className="min-w-0">
                                        <p className="truncate text-[8px] font-semibold text-[#29465F]">
                                          {name}
                                        </p>

                                        {jobTitle && (
                                          <p className="mt-0.5 truncate text-[6.5px] text-[#9AA8B5]">
                                            {
                                              jobTitle
                                            }
                                          </p>
                                        )}

                                        {phone && (
                                          <p className="mt-0.5 truncate text-[6.5px] text-[#9AA8B5]">
                                            {
                                              phone
                                            }
                                          </p>
                                        )}
                                      </div>

                                      {/* Email */}

                                      <div className="min-w-0 flex items-center">
                                        <p className="truncate text-[7px] text-[#526B80]">
                                          {
                                            email
                                          }
                                        </p>
                                      </div>

                                      {/* Company */}

                                      <div className="min-w-0 flex items-center">
                                        <p className="truncate text-[7px] text-[#526B80]">
                                          {company ||
                                            "—"}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            className="
                              rounded-[7px]
                              border
                              border-[#DCE5ED]
                              bg-[#F8FAFC]
                              px-3
                              py-5
                              text-center
                            "
                          >
                            <Users
                              size={18}
                              strokeWidth={1.5}
                              className="mx-auto mb-2 text-[#9AA8B5]"
                            />

                            <p className="text-[8px] font-semibold text-[#526B80]">
                              No HubSpot contacts found
                            </p>

                            <p className="mt-1 text-[7px] text-[#9AA8B5]">
                              Your HubSpot CRM did not
                              return any contacts.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                  {/* Pagination */}

                  {hubSpotContactsLoaded &&
                    hubSpotContacts.length >
                      0 && (
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={
                            handlePreviousHubSpotContacts
                          }
                          disabled={
                            !hubSpotPreviousAfter ||
                            hubSpotContactsLoading
                          }
                          className="
                            flex
                            h-[26px]
                            items-center
                            gap-1
                            rounded-[5px]
                            border
                            border-[#D8E2EA]
                            bg-white
                            px-2.5
                            text-[7px]
                            font-semibold
                            text-[#526B80]
                            hover:bg-[#F8FAFC]
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                        >
                          <ChevronLeft
                            size={11}
                          />

                          Previous
                        </button>

                        <span className="text-[7px] text-[#9AA8B5]">
                          Showing{" "}
                          {
                            hubSpotContacts.length
                          }{" "}
                          contacts
                        </span>

                        <button
                          type="button"
                          onClick={
                            handleNextHubSpotContacts
                          }
                          disabled={
                            !hubSpotNextAfter ||
                            hubSpotContactsLoading
                          }
                          className="
                            flex
                            h-[26px]
                            items-center
                            gap-1
                            rounded-[5px]
                            border
                            border-[#D8E2EA]
                            bg-white
                            px-2.5
                            text-[7px]
                            font-semibold
                            text-[#526B80]
                            hover:bg-[#F8FAFC]
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                        >
                          Next

                          <ChevronRight
                            size={11}
                          />
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              /* =================================================
                 GENERIC CONFIGURATION
              ================================================= */

              <div>
                <div className="space-y-4 px-4 py-4">
                  {/* Workspace / Account */}

                  <div>
                    <label className="mb-1.5 block text-[8px] font-semibold text-[#29465F]">
                      Workspace / Account
                    </label>

                    <input
                      type="text"
                      value={
                        config.workspaceName
                      }
                      onChange={(e) =>
                        handleConfigChange(
                          "workspaceName",
                          e.target.value
                        )
                      }
                      placeholder={`Enter ${selectedIntegration.name} workspace or account`}
                      className="
                        h-[32px]
                        w-full
                        rounded-[6px]
                        border
                        border-[#D8E2EA]
                        bg-white
                        px-2.5
                        text-[9px]
                        text-[#29465F]
                        outline-none
                        placeholder:text-[#9AA8B5]
                        focus:border-[#8CB8D8]
                      "
                    />
                  </div>

                  {/* Account Email */}

                  <div>
                    <label className="mb-1.5 block text-[8px] font-semibold text-[#29465F]">
                      Account Email
                    </label>

                    <input
                      type="email"
                      value={
                        config.accountEmail
                      }
                      onChange={(e) =>
                        handleConfigChange(
                          "accountEmail",
                          e.target.value
                        )
                      }
                      placeholder="Enter account email"
                      className="
                        h-[32px]
                        w-full
                        rounded-[6px]
                        border
                        border-[#D8E2EA]
                        bg-white
                        px-2.5
                        text-[9px]
                        text-[#29465F]
                        outline-none
                        placeholder:text-[#9AA8B5]
                        focus:border-[#8CB8D8]
                      "
                    />
                  </div>

                  {/* Notifications */}

                  <div
                    className="
                      rounded-[7px]
                      border
                      border-[#DCE5ED]
                      bg-[#F8FAFC]
                      p-3
                    "
                  >
                    <p className="mb-2 text-[9px] font-bold text-[#17324D]">
                      Notifications
                    </p>

                    <label className="flex cursor-pointer items-center justify-between py-1.5">
                      <span className="text-[8px] text-[#526B80]">
                        Enable notifications
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          config.notifications
                        }
                        onChange={(e) =>
                          handleConfigChange(
                            "notifications",
                            e.target.checked
                          )
                        }
                        className="h-3 w-3"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between py-1.5">
                      <span className="text-[8px] text-[#526B80]">
                        Lead notifications
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          config.leadNotifications
                        }
                        onChange={(e) =>
                          handleConfigChange(
                            "leadNotifications",
                            e.target.checked
                          )
                        }
                        className="h-3 w-3"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between py-1.5">
                      <span className="text-[8px] text-[#526B80]">
                        Deal notifications
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          config.dealNotifications
                        }
                        onChange={(e) =>
                          handleConfigChange(
                            "dealNotifications",
                            e.target.checked
                          )
                        }
                        className="h-3 w-3"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between py-1.5">
                      <span className="text-[8px] text-[#526B80]">
                        Team notifications
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          config.teamNotifications
                        }
                        onChange={(e) =>
                          handleConfigChange(
                            "teamNotifications",
                            e.target.checked
                          )
                        }
                        className="h-3 w-3"
                      />
                    </label>
                  </div>

                  {/* Error */}

                  {configError && (
                    <p className="rounded-[5px] bg-[#FFF5F5] px-2.5 py-2 text-[8px] text-[#EF4444]">
                      {configError}
                    </p>
                  )}

                  {/* Success */}

                  {configSuccess && (
                    <p className="rounded-[5px] bg-[#E8F8EF] px-2.5 py-2 text-[8px] text-[#20A65A]">
                      {configSuccess}
                    </p>
                  )}
                </div>

                {/* Generic Modal Footer */}

                <div
                  className="
                    flex
                    justify-end
                    gap-2
                    border-t
                    border-[#DCE5ED]
                    px-4
                    py-3
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleCloseConfigure
                    }
                    disabled={
                      configSaving
                    }
                    className="
                      h-[28px]
                      rounded-[5px]
                      border
                      border-[#D8E2EA]
                      bg-white
                      px-3
                      text-[8px]
                      font-semibold
                      text-[#29465F]
                      hover:bg-[#F8FAFC]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSaveConfiguration
                    }
                    disabled={
                      configSaving
                    }
                    className="
                      h-[28px]
                      rounded-[5px]
                      bg-[#123F63]
                      px-3
                      text-[8px]
                      font-semibold
                      text-white
                      hover:bg-[#0E3453]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {configSaving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                HUBSPOT MODAL FOOTER
            ================================================= */}

            {selectedIntegration.key?.toLowerCase() ===
              "hubspot" && (
              <div
                className="
                  flex
                  justify-end
                  gap-2
                  border-t
                  border-[#DCE5ED]
                  px-4
                  py-3
                "
              >
                <button
                  type="button"
                  onClick={
                    handleCloseConfigure
                  }
                  disabled={
                    hubSpotContactsLoading
                  }
                  className="
                    h-[28px]
                    rounded-[5px]
                    border
                    border-[#D8E2EA]
                    bg-white
                    px-3
                    text-[8px]
                    font-semibold
                    text-[#29465F]
                    hover:bg-[#F8FAFC]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectedIntegrations;