import {
  Code2,
  KeyRound,
  Webhook,
} from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

const ApiWebhooks = () => {
  return (
    <Card className="w-full overflow-hidden">
      {/* Header */}
      <div
        className="
          flex
          h-[50px]
          items-center
          gap-2
          border-b
          border-[#DCE5ED]
          px-[18px]
        "
      >
        <Code2
          size={15}
          strokeWidth={1.8}
          className="text-[#60758A]"
        />

        <h2 className="text-[14px] font-bold text-[#102F4A]">
          API &amp; Webhooks
        </h2>
      </div>

      {/* API Access */}
      <div
        className="
          flex
          min-h-[68px]
          items-center
          justify-between
          gap-4
          border-b
          border-[#DCE5ED]
          px-[18px]
          py-[10px]
        "
      >
        <div>
          <h3 className="text-[9px] font-bold text-[#17324D]">
            API Access
          </h3>

          <p className="mt-1 text-[8px] text-[#718599]">
            Generate and manage API keys for custom integrations and developer access.
          </p>
        </div>

        <Button
          variant="secondary"
          className="
            flex
            h-[28px]
            shrink-0
            items-center
            gap-1.5
            rounded-[6px]
            border-[#D8E2EA]
            bg-[#EEF4FC]
            px-3
            text-[8px]
            font-semibold
            text-[#29465F]
          "
        >
          <KeyRound size={11} />
          Manage API Keys
        </Button>
      </div>

      {/* Webhooks */}
      <div
        className="
          flex
          min-h-[68px]
          items-center
          justify-between
          gap-4
          px-[18px]
          py-[10px]
        "
      >
        <div>
          <h3 className="text-[9px] font-bold text-[#17324D]">
            Webhooks
          </h3>

          <p className="mt-1 text-[8px] text-[#718599]">
            Set up endpoints to receive real-time data updates from BusinessFlow events.
          </p>
        </div>

        <Button
          variant="secondary"
          className="
            flex
            h-[28px]
            shrink-0
            items-center
            gap-1.5
            rounded-[6px]
            border-[#D8E2EA]
            bg-[#EEF4FC]
            px-3
            text-[8px]
            font-semibold
            text-[#29465F]
          "
        >
          <Webhook size={11} />
          Manage Webhooks
        </Button>
      </div>
    </Card>
  );
};

export default ApiWebhooks;