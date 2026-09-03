const DealsHeader = () => {
  return (
    <section className="w-full bg-[#F7F9FC]">
      <div className="flex min-h-[65px] flex-col justify-center pb-3">
        <h1
          className="
            text-[24px]
            font-bold
            leading-[30px]
            tracking-[-0.5px]
            text-[#0B2942]
          "
        >
          Deals
        </h1>

        <p
          className="
            mt-[3px]
            text-[11px]
            font-medium
            leading-[16px]
            text-[#60758A]
            mb-[4px]
          "
        >
          Manage your sales pipeline and track deal progress.


        </p>
      </div>
    </section>
  );
};

export default DealsHeader;