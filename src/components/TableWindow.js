import React, { useEffect, useState, useRef, useCallback } from 'react';
import './TableWindow.css';

const ROWS_PER_PAGE = 20; // Number of rows to load at a time

const TableWindow = ({ title, size }) => {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allRows, setAllRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [page, setPage] = useState(0);
  const observerTarget = useRef(null);
  const tableContainerRef = useRef(null);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadMoreRows = useCallback(() => {
    const start = page * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    const newRows = allRows.slice(start, end);
    if (newRows.length > 0) {
      setVisibleRows(prev => [...prev, ...newRows]);
      setPage(p => p + 1);
    }
  }, [page, allRows]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreRows();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreRows]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sheet-data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const rows = await response.json();
        
        if (rows && rows.length > 0) {
          const headers = rows[0];
          const tableData = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });
          setAllRows(tableData);
          setVisibleRows(tableData.slice(0, ROWS_PER_PAGE));
          setPage(1);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update table container size when window size changes
    if (tableContainerRef.current) {
      tableContainerRef.current.style.width = `${size.width}px`;
      tableContainerRef.current.style.height = `${size.height}px`;
    }
  }, [size]);

  if (loading) return <div className="table-loading">Loading...</div>;
  if (error) return <div className="table-error">Error: {error}</div>;

  return (
    <div className="table-container" ref={tableContainerRef}>
      <div className="table-title">
        {getCurrentDate()}
      </div>
      <div className="table-scroll-container">
        <table className="data-table">
          <thead>
            <tr>
              {visibleRows.length > 0 && Object.keys(visibleRows[0]).map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={observerTarget} className="observer-target">
          {visibleRows.length < allRows.length && (
            <div className="loading-more">Loading more...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableWindow; 