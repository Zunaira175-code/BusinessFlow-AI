import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  Search,
  CreditCard,
  CalendarDays,
  Mail,
  MessageSquare,
  Database,
} from "lucide-react";

import Card from "../common/Card";
import IntegrationCard from "../common/IntegrationCard";

// =====================================================
// API
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =====================================================
// TOKEN HELPER
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("businessflow_token") ||
    sessionStorage.getItem("businessflow_token")
  );
};

// =====================================================
// ALLOWED INTEGRATIONS
// =====================================================

const ALLOWED_INTEGRATIONS = [
  "hubspot",
  "google_calendar",
  "google_workspace",
  "slack",
  "stripe",
];

// =====================================================
// ICON MAPPING
// =====================================================

const iconMap = {
  hubspot: Database,
  google_calendar: CalendarDays,
  google_workspace: Mail,
  slack: MessageSquare,
  stripe: CreditCard,
};

// =====================================================
// ICON CLASS MAPPING
// =====================================================

const iconClassMap = {
  hubspot: "text-[#FF7A59]",
  google_calendar: "text-[#4285F4]",
  google_workspace: "text-[#4285F4]",
  slack: "text-[#611F69]",
  stripe: "text-[#635BFF]",
};

// =====================================================
// COMPONENT
// =====================================================

const AvailableIntegrations = () => {
  const [integrations, setIntegrations] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH AVAILABLE INTEGRATIONS
  // ===================================================

  const fetchAvailableIntegrations =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/api/integrations/available`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Unable to fetch available integrations."
          );
        }

        // =================================================
        // BACKEND INTEGRATIONS
        // =================================================

        const availableIntegrations =
          result.data?.integrations || [];

        // =================================================
        // FRONTEND HUBSPOT CARD
        //
        // HubSpot backend record will be added later.
        // For now we add the card directly here.
        // =================================================

        const hasHubSpot =
          availableIntegrations.some(
            (integration) =>
              integration.key?.toLowerCase() ===
              "hubspot"
          );

        const integrationsWithHubSpot =
          hasHubSpot
            ? availableIntegrations
            : [
                {
                  _id:
                    "frontend-hubspot",
                  name: "HubSpot",
                  key: "hubspot",
                  category: "available",
                  status: "disconnected",
                  description:
                    "Connect HubSpot contacts and CRM data with BusinessFlow AI.",
                  icon: "hubspot",
                },
                ...availableIntegrations,
              ];

        // =================================================
        // ONLY SHOW REQUIRED INTEGRATIONS
        // =================================================

        const filteredIntegrations =
          integrationsWithHubSpot.filter(
            (integration) =>
              ALLOWED_INTEGRATIONS.includes(
                integration.key?.toLowerCase()
              )
          );

        // =================================================
        // SORT ORDER
        //
        // HubSpot first
        // =================================================

        const sortedIntegrations =
          [...filteredIntegrations].sort(
            (a, b) => {
              const aIndex =
                ALLOWED_INTEGRATIONS.indexOf(
                  a.key?.toLowerCase()
                );

              const bIndex =
                ALLOWED_INTEGRATIONS.indexOf(
                  b.key?.toLowerCase()
                );

              return aIndex - bIndex;
            }
          );

        setIntegrations(
          sortedIntegrations
        );
      } catch (error) {
        console.error(
          "Fetch Available Integrations Error:",
          error
        );

        setError(
          error.message ||
            "Unable to load available integrations."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchAvailableIntegrations();

    const handleIntegrationUpdate =
      () => {
        fetchAvailableIntegrations();
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
  }, [fetchAvailableIntegrations]);

  // ===================================================
  // CONNECT INTEGRATION
  // ===================================================

  const handleConnect = async (
    integration
  ) => {
    try {
      setActionLoading(
        integration._id
      );

      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/integrations/connect`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            key: integration.key,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to connect integration."
        );
      }

      // =================================================
      // HUBSPOT OAUTH
      // =================================================

      if (
        integration.key?.toLowerCase() ===
          "hubspot" &&
        result.data?.authorizationUrl
      ) {
        window.location.href =
          result.data.authorizationUrl;

        return;
      }

      // =================================================
      // NORMAL INTEGRATIONS
      // =================================================

      setIntegrations(
        (current) =>
          current.filter(
            (item) =>
              item._id !==
              integration._id
          )
      );

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
  // SEARCH FILTER
  // ===================================================

  const filteredIntegrations =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (!search) {
        return integrations;
      }

      return integrations.filter(
        (integration) =>
          integration.name
            ?.toLowerCase()
            .includes(search) ||
          integration.description
            ?.toLowerCase()
            .includes(search)
      );
    }, [
      integrations,
      searchTerm,
    ]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <Card className="w-full overflow-hidden">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          h-[50px]
          items-center
          justify-between
          border-b
          border-[#DCE5ED]
          px-[18px]
        "
      >
        <h2 className="text-[14px] font-bold text-[#102F4A]">
          Available Integrations
        </h2>

        <div
          className="
            flex
            h-[28px]
            w-[145px]
            items-center
            gap-2
            rounded-[6px]
            border
            border-[#D8E2EA]
            bg-white
            px-2
          "
        >
          <Search
            size={12}
            strokeWidth={1.8}
            className="text-[#718599]"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder="Search apps..."
            className="
              w-full
              bg-transparent
              text-[8px]
              text-[#29465C]
              outline-none
              placeholder:text-[#9AA8B5]
            "
          />
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="border-b border-[#DCE5ED] px-[18px] py-2">
          <p className="text-[9px] text-[#EF4444]">
            {error}
          </p>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <p className="text-[9px] text-[#718599]">
            Loading integrations...
          </p>
        </div>
      ) : (
        <>
          {/* =============================================
              AVAILABLE INTEGRATION CARDS
          ============================================== */}

          <div className="grid grid-cols-2 gap-3 p-[14px]">
            {filteredIntegrations.map(
              (integration) => {
                const integrationKey =
                  integration.key?.toLowerCase();

                const Icon =
                  iconMap[
                    integrationKey
                  ] ||
                  BriefcaseBusiness;

                const isConnecting =
                  actionLoading ===
                  integration._id;

                return (
                  <IntegrationCard
                    key={integration._id}
                    icon={Icon}
                    name={
                      integration.name
                    }
                    description={
                      integration.description
                    }
                    action={
                      integration.status ===
                      "connected"
                        ? "Connected"
                        : "Connect"
                    }
                    iconClassName={
                      iconClassMap[
                        integrationKey
                      ]
                    }
                    onAction={() =>
                      handleConnect(
                        integration
                      )
                    }
                    loading={
                      isConnecting
                    }
                    disabled={
                      integration.status ===
                      "connected"
                    }
                  />
                );
              }
            )}
          </div>

          {/* =============================================
              NO RESULTS
          ============================================== */}

          {filteredIntegrations.length ===
            0 && (
            <div className="flex min-h-[100px] items-center justify-center px-4">
              <p className="text-[9px] text-[#718599]">
                {searchTerm
                  ? "No integrations found."
                  : "No available integrations found."}
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default AvailableIntegrations;