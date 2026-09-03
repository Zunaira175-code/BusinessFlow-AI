import { Pencil, CreditCard } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/button";

const BillingInformation = () => {
  return (
    <Card className="h-[165px] overflow-hidden px-[16px] py-[14px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#102F4A]">
          Billing Information
        </h2>

        <button
          type="button"
          aria-label="Edit billing information"
          className="
            flex
            h-[24px]
            w-[24px]
            items-center
            justify-center
            rounded-[5px]
            text-[#29465F]
            hover:bg-[#F4F7FA]
          "
        >
          <Pencil size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Information */}
      <div className="mt-[12px] space-y-[7px]">
        <div className="flex">
          <span className="w-[105px] text-[8px] font-medium text-[#718599]">
            Company:
          </span>

          <span className="text-[8px] font-semibold text-[#29445C]">
            Acme Corporation
          </span>
        </div>

        <div className="flex">
          <span className="w-[105px] text-[8px] font-medium text-[#718599]">
            Email:
          </span>

          <span className="text-[8px] font-semibold text-[#29445C]">
            billing@acmecorp.com
          </span>
        </div>

        <div className="flex">
          <span className="w-[105px] text-[8px] font-medium text-[#718599]">
            Payment:
          </span>

          <span className="flex items-center gap-1 text-[8px] font-semibold text-[#29445C]">
            <CreditCard size={10} />
            Visa ending in 4242
          </span>
        </div>

        <div className="flex">
          <span className="w-[105px] text-[8px] font-medium text-[#718599]">
            Next Date:
          </span>

          <span className="text-[8px] font-semibold text-[#29445C]">
            Sept 17, 2026
          </span>
        </div>
      </div>

      {/* Button */}
      <Button
        variant="secondary"
        className="
          mt-[10px]
          h-[27px]
          w-full
          rounded-[6px]
          bg-[#EEF4FC]
          text-[8px]
          font-semibold
          text-[#29465F]
        "
      >
        Update Billing Information
      </Button>
    </Card>
  );
};

export default BillingInformation;