import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   TASK PAGINATION
========================================================= */

const TaskPagination = ({
  currentPage = 1,
  totalPages = 4,
  totalItems = 24,
  startItem = 1,
  endItem = 7,
  onPageChange,
}) => {
  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    onPageChange?.(page);
  };

  const pages = getVisiblePages(
    currentPage,
    totalPages
  );

  return (
    <div
      className="
        flex
        flex-col
        gap-3
        border-t
        border-[#E1E8EF]
        px-4
        py-3
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* =====================================================
          RESULTS INFO
      ====================================================== */}

      <p
        className="
          text-[11px]
          font-medium
          text-[#71869A]
        "
      >
        Showing{" "}
        <span className="font-semibold text-[#526B7E]">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-[#526B7E]">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[#526B7E]">
          {totalItems}
        </span>{" "}
        tasks
      </p>

      {/* =====================================================
          PAGINATION BUTTONS
      ====================================================== */}

      <div className="flex items-center gap-1">
        {/* Previous */}
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() =>
            handlePageChange(currentPage - 1)
          }
          ariaLabel="Previous page"
        >
          <ChevronLeft
            size={14}
            strokeWidth={1.8}
          />
        </PaginationButton>

        {/* Page Numbers */}
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="
                  flex
                  h-8
                  min-w-8
                  items-center
                  justify-center
                  text-[10px]
                  font-semibold
                  text-[#8A9AA8]
                "
              >
                ...
              </span>
            );
          }

          return (
            <PaginationButton
              key={page}
              active={page === currentPage}
              onClick={() =>
                handlePageChange(page)
              }
              ariaLabel={`Page ${page}`}
            >
              {page}
            </PaginationButton>
          );
        })}

        {/* Next */}
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() =>
            handlePageChange(currentPage + 1)
          }
          ariaLabel="Next page"
        >
          <ChevronRight
            size={14}
            strokeWidth={1.8}
          />
        </PaginationButton>
      </div>
    </div>
  );
};

/* =========================================================
   PAGINATION BUTTON
========================================================= */

const PaginationButton = ({
  children,
  active = false,
  disabled = false,
  onClick,
  ariaLabel,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        flex
        h-8
        min-w-8
        items-center
        justify-center
        rounded-[6px]
        border
        px-2
        text-[10px]
        font-semibold
        transition-all
        duration-150

        ${
          active
            ? `
              border-[#0B477A]
              bg-[#0B477A]
              text-white
              shadow-[0_2px_6px_rgba(11,71,122,0.15)]
            `
            : `
              border-[#DCE5EE]
              bg-white
              text-[#587084]
              hover:bg-[#F4F8FB]
              hover:text-[#173750]
            `
        }

        ${
          disabled
            ? `
              cursor-not-allowed
              opacity-40
              hover:bg-white
              hover:text-[#587084]
            `
            : ""
        }
      `}
    >
      {children}
    </button>
  );
};

/* =========================================================
   VISIBLE PAGES
========================================================= */

const getVisiblePages = (
  currentPage,
  totalPages
) => {
  /* -----------------------------------------------
     No pages
  ------------------------------------------------ */

  if (totalPages <= 0) {
    return [];
  }

  /* -----------------------------------------------
     Small number of pages
  ------------------------------------------------ */

  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  /* -----------------------------------------------
     Beginning
  ------------------------------------------------ */

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  /* -----------------------------------------------
     End
  ------------------------------------------------ */

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  /* -----------------------------------------------
     Middle
  ------------------------------------------------ */

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export default TaskPagination;