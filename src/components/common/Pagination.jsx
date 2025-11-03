import { useState, useEffect } from "react";

const Pagination = ({ totalPages, currentPage, paginate, nextPage, prevPage, firstPage, lastPage }) => {
    const [inputValue, setInputValue] = useState(currentPage);

    useEffect(() => {
        setInputValue(currentPage);
    }, [currentPage]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const goToPage = () => {
        const pageNumber = parseInt(inputValue, 10);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber);
        } else {
            setInputValue(currentPage);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            goToPage();
        }
    };

    const pageNumbers = [];
    let startPage, endPage;
    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 1 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination-container">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button onClick={firstPage} className="page-link" disabled={currentPage === 1}>
                        &lt;&lt;
                    </button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button onClick={prevPage} className="page-link" disabled={currentPage === 1}>
                        &lt;
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button onClick={nextPage} className="page-link" disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </li>
                 <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button onClick={lastPage} className="page-link" disabled={currentPage === totalPages}>
                        &gt;&gt;
                    </button>
                </li>
            </ul>
             <div className="pagination-input-container">
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    min="1"
                    max={totalPages}
                />
                <span>de {totalPages}</span>
                <button onClick={goToPage} className="pagination-go-button">Ir</button>
            </div>
        </div>
    );
};

export default Pagination;