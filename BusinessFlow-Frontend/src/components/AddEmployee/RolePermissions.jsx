import {
  ShieldCheck,
  UserRound,
} from "lucide-react";

const RolePermissions = () => {
  return (
    <section className="w-full overflow-hidden rounded-lg border border-[#DCE7F1] bg-white">

      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[#E7EEF4] px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF5FF] text-[#1677E8]">
          <ShieldCheck size={16} strokeWidth={1.9} />
        </div>

        <h2 className="text-[15px] font-semibold text-[#102F4B]">
          Role Permissions
        </h2>
      </div>

      {/* Permissions */}
      <div className="divide-y divide-[#EEF2F6]">

        {/* Admin */}
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F8EF] text-[#16A05D]">
            <ShieldCheck size={16} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[12px] font-semibold text-[#193B5B]">
              Admin
            </h3>

            <p className="mt-0.5 text-[10px] leading-[15px] text-[#71869A]">
              Full access to all features, team management, and settings.
            </p>
          </div>
        </div>

        {/* Employee */}
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F1FF] text-[#1677E8]">
            <UserRound size={16} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[12px] font-semibold text-[#193B5B]">
              Employee
            </h3>

            <p className="mt-0.5 text-[10px] leading-[15px] text-[#71869A]">
              Access to assigned features, leads, and tasks.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RolePermissions;