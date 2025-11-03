import { useState, useMemo } from "react";

export const usePagination = (initialTotalPages = 1) => {
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [currentPage, setCurrentPage] = useState(1);

    useMemo(() => {
        setTotalPages(initialTotalPages);
        if (currentPage > initialTotalPages) {
            setCurrentPage(initialTotalPages || 1);
        }
    }, [initialTotalPages, currentPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    const firstPage = () => setCurrentPage(1);
    const lastPage = () => setCurrentPage(totalPages);

    return {
        currentPage,
        totalPages,
        paginate,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        setCurrentPage,
        setTotalPages,
    };
};