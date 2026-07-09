/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ReactNode, UIEvent, useEffect } from "react";
import { JetBrains_Mono } from "next/font/google";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface VirtualizedTableProps {
  headers: string[];
  rows: Record<string, any>[];
  rowHeight?: number;
  maxHeight?: number;
  overscan?: number;
  renderCell?: (row: Record<string, any>, header: string) => ReactNode;
  onRowClick?: (row: Record<string, any>, index: number) => void;
}

export default function VirtualizedTable({
  headers,
  rows,
  rowHeight = 40,
  maxHeight = 400,
  overscan = 6,
  renderCell,
  onRowClick,
}: VirtualizedTableProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const totalHeight = rows.length * rowHeight;
  const viewportHeight = Math.min(maxHeight, totalHeight || rowHeight);

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(rows.length, startIndex + visibleCount);

  const visibleRows = rows.slice(startIndex, endIndex);
  const paddingTop = startIndex * rowHeight;
  const paddingBottom = (rows.length - endIndex) * rowHeight;

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    setScrollTop(e.currentTarget.scrollTop);
  }

  const getRowBackgroundColor = (index: number) => {
    if (isDark) {
      return index % 2 === 0 ? "#131B15" : "#0F1712";
    }
    return index % 2 === 0 ? "#FFFFFF" : "#F7F9F4";
  };

  const getHoverBackgroundColor = () => {
    return isDark ? "#1C271F" : "#EAF1E6";
  };

  return (
    <div
      onScroll={handleScroll}
      className="overflow-auto rounded-lg border"
      style={{
        maxHeight,
        borderColor: isDark ? "#2A362E" : "#D7DFCF",
      }}
    >
      <table className="min-w-full text-sm">
        <thead
          className="sticky top-0 z-10"
          style={{
            backgroundColor: isDark ? "#1C271F" : "#EAF1E6",
          }}
        >
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className={`${mono.className} p-3 border-b text-left text-xs uppercase tracking-wide`}
                style={{
                  borderColor: isDark ? "#2A362E" : "#D7DFCF",
                  color: isDark ? "#8FA090" : "#5B6B5F",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paddingTop > 0 && (
            <tr style={{ height: paddingTop }} aria-hidden>
              <td
                colSpan={headers.length}
                style={{ padding: 0, border: "none" }}
              />
            </tr>
          )}

          {visibleRows.map((row, i) => {
            const actualIndex = startIndex + i;
            return (
              <tr
                key={actualIndex}
                onClick={
                  onRowClick ? () => onRowClick(row, actualIndex) : undefined
                }
                className={`transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                style={{
                  height: rowHeight,
                  backgroundColor: getRowBackgroundColor(actualIndex),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    getHoverBackgroundColor();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    getRowBackgroundColor(actualIndex);
                }}
              >
                {headers.map((h) => (
                  <td
                    key={h}
                    className={`${mono.className} px-3 border-b truncate max-w-65`}
                    style={{
                      borderColor: isDark ? "#222B25" : "#E3E9DC",
                      color: isDark ? "#E7EDE2" : "#16241C",
                    }}
                  >
                    {renderCell ? renderCell(row, h) : String(row[h] ?? "")}
                  </td>
                ))}
              </tr>
            );
          })}

          {paddingBottom > 0 && (
            <tr style={{ height: paddingBottom }} aria-hidden>
              <td
                colSpan={headers.length}
                style={{ padding: 0, border: "none" }}
              />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
