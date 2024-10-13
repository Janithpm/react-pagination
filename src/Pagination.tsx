import { useState } from "react";


const p = 10;

enum GROUP {
  START = 'start',
  MIDDLE = 'middle',
  MIDDLE_START = 'middle-start',
  MIDDLE_END = 'middle-end',
  END = 'end'
}

function nearestLowerMultipleOfTen(number: number) {
  return Math.floor(number / 10) * 10;
}

function nearestHigherMultipleOfTen(number: number) {
  return Math.ceil(number / 10) * 10;
}

const Button = (pageNumber: number, group: GROUP) => {
  return {
    pageNumber,
    group
  };
};

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const calculateButtons = (currentPage: number, totalPages: number) => {
    const buttonsMap = new Map<number, { pageNumber: number; group: GROUP }>();

    const addButton = (pageNumber: number, group: GROUP) => {
      if (!buttonsMap.has(pageNumber)) {
        buttonsMap.set(pageNumber, Button(pageNumber, group));
      }
    };

    addButton(1, GROUP.START);
    addButton(totalPages, GROUP.END);

    if (currentPage > 2) addButton(currentPage - 2, GROUP.MIDDLE_START);
    if (currentPage > 1) addButton(currentPage - 1, GROUP.MIDDLE);

    addButton(currentPage, GROUP.MIDDLE);

    if (currentPage < totalPages) addButton(currentPage + 1, GROUP.MIDDLE);
    if (currentPage < totalPages - 1) addButton(currentPage + 2, GROUP.MIDDLE_END);

    const lowerAcc = nearestLowerMultipleOfTen(currentPage - p);
    const lowerAccSquared = nearestLowerMultipleOfTen(currentPage - p * p);
    const higherAcc = nearestHigherMultipleOfTen(currentPage + p);
    const higherAccSquared = nearestHigherMultipleOfTen(currentPage + p * p);

    if (lowerAcc >= 1) addButton(lowerAcc, GROUP.START);
    if (lowerAccSquared >= 1) addButton(lowerAccSquared, GROUP.START);

    if (higherAcc <= totalPages) addButton(higherAcc, GROUP.END);
    if (higherAccSquared <= totalPages) addButton(higherAccSquared, GROUP.END);

    return Array.from(buttonsMap.values())
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .slice(0, 11);
  };

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const buttons = calculateButtons(currentPage, totalPages);

    return buttons.map((b) => {
      console.log(b);

      if (b.group === GROUP.MIDDLE_START) {
        return <>
          <span>...</span>
          <button
            key={b.pageNumber}
            className={`page-item ${b.pageNumber === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(b.pageNumber)}
          >
            {b.pageNumber}
          </button>
        </>
      } else if (b.group === GROUP.MIDDLE_END) {
        return <>
          <button
            key={b.pageNumber}
            className={`page-item ${b.pageNumber === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(b.pageNumber)}
          >
            {b.pageNumber}
          </button>
          <span>...</span>
        </>
      } else {
        return <button
          key={b.pageNumber}
          className={`page-item ${b.pageNumber === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(b.pageNumber)}
        >
          {b.pageNumber}
        </button>
      }

    });
  };

  return (
    <div className="pagination">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      {renderPageNumbers()}
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};


export default Pagination;