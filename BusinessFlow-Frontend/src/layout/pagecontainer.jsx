const PageContainer = ({ children }) => {
  return (
    <main className="w-full bg-[#F7F9FC]">
      <div className="mx-auto w-full max-w-[1440px] px-7 py-7">
        {children}
      </div>
    </main>
  );
};

export default PageContainer;