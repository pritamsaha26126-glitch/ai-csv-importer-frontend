/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { JetBrains_Mono } from "next/font/google";
import { getHistory } from "@/services/api";
import { FileText, CheckCircle, ChevronDown } from "lucide-react";
import VirtualizedTable from "./VirtualizedTable";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function ImportHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const data = await getHistory();
      setHistory(data.history);
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  if (loading) {
    return (
      <div
        className={`${mono.className} p-10 text-center text-sm`}
        style={{
          color: isDark ? "#8FA090" : "#7C8A7A",
        }}
      >
        Loading history...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2
        className="text-2xl font-bold"
        style={{
          color: isDark ? "#E7EDE2" : "#16241C",
        }}
      >
        Import History
      </h2>

      <div className="grid gap-4">
        {history.map((item) => {
          const isOpen = expandedId === item._id;
          const detailRows = Object.entries(item).filter(
            ([key]) => !["_id", "records"].includes(key),
          );
          const recordHeaders =
            Array.isArray(item.records) && item.records.length > 0
              ? Object.keys(item.records[0])
              : [];

          return (
            <div
              key={item._id}
              className="rounded-lg border shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              style={{
                borderColor: isDark ? "#2A362E" : "#D7DFCF",
                backgroundColor: isDark ? "#16201A" : "#FFFFFF",
              }}
            >
              <button
                onClick={() => toggle(item._id)}
                className="w-full flex justify-between items-center p-5 text-left focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2F6B4F]"
              >
                <div className="flex gap-4 items-center">
                  <div
                    className="p-3 rounded-md"
                    style={{
                      backgroundColor: isDark ? "#1C271F" : "#EAF1E6",
                    }}
                  >
                    <FileText
                      className="text-[#2F6B4F] dark:text-[#4CA378]"
                      size={20}
                      style={{
                        color: isDark ? "#4CA378" : "#2F6B4F",
                      }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-semibold"
                      style={{
                        color: isDark ? "#E7EDE2" : "#16241C",
                      }}
                    >
                      {item.fileName}
                    </h3>
                    <p
                      className={`${mono.className} text-xs`}
                      style={{
                        color: isDark ? "#8FA090" : "#7C8A7A",
                      }}
                    >
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <div className="text-center">
                    <p
                      className={`${mono.className} font-bold`}
                      style={{
                        color: isDark ? "#E7EDE2" : "#16241C",
                      }}
                    >
                      {item.importedRecords}
                    </p>
                    <span
                      className="text-xs"
                      style={{
                        color: isDark ? "#8FA090" : "#7C8A7A",
                      }}
                    >
                      Imported
                    </span>
                  </div>

                  <div className="text-center">
                    <p
                      className={`${mono.className} font-bold`}
                      style={{
                        color: isDark ? "#E7EDE2" : "#16241C",
                      }}
                    >
                      {item.skippedRecords}
                    </p>
                    <span
                      className="text-xs"
                      style={{
                        color: isDark ? "#8FA090" : "#7C8A7A",
                      }}
                    >
                      Skipped
                    </span>
                  </div>

                  <span
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                    style={{
                      color: isDark ? "#4CA378" : "#2F6B4F",
                      backgroundColor: isDark ? "#1C271F" : "#EAF1E6",
                    }}
                  >
                    <CheckCircle size={15} />
                    {item.status}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    style={{
                      color: isDark ? "#8FA090" : "#7C8A7A",
                    }}
                  />
                </div>
              </button>

              {isOpen && (
                <div
                  className="border-t p-5"
                  style={{
                    borderColor: isDark ? "#2A362E" : "#D7DFCF",
                    backgroundColor: isDark ? "#10160F" : "#F7F9F4",
                  }}
                >
                  <table className={`${mono.className} w-full text-xs`}>
                    <tbody>
                      {detailRows.map(([key, value]) => (
                        <tr
                          key={key}
                          className="border-b last:border-0"
                          style={{
                            borderColor: isDark ? "#222B25" : "#E3E9DC",
                          }}
                        >
                          <td
                            className="py-2 pr-4 uppercase tracking-wide w-40"
                            style={{
                              color: isDark ? "#8FA090" : "#7C8A7A",
                            }}
                          >
                            {key}
                          </td>
                          <td
                            className="py-2"
                            style={{
                              color: isDark ? "#E7EDE2" : "#16241C",
                            }}
                          >
                            {String(value ?? "—")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {recordHeaders.length > 0 && (
                    <div className="mt-4">
                      <VirtualizedTable
                        headers={recordHeaders}
                        rows={item.records}
                        maxHeight={260}
                        rowHeight={36}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
