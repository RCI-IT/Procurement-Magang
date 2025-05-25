// components/Pagination.js
import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const pageNumbers = [];

  let start = Math.max(1, currentPage - 1);
  let end = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) {
    end = Math.min(totalPages, 3);
  } else if (currentPage === totalPages) {
    start = Math.max(1, totalPages - 2);
  }

  for (let page = start; page <= end; page++) {
    pageNumbers.push(page);
  }

  return (
    <div className="flex justify-center mt-6">
      <nav
        className="inline-flex rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 text-blue-600 hover:bg-gray-100 disabled:text-gray-400"
        >
          «
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 border border-gray-300 rounded ${
              currentPage === page
                ? "text-white bg-blue-500"
                : "text-blue-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-300 text-blue-600 hover:bg-gray-100 disabled:text-gray-400"
        >
          »
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
