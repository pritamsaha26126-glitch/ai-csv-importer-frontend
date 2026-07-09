/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { JetBrains_Mono } from "next/font/google";

import { getHistory } from "@/services/api";
import { FileText, CheckCircle, ChevronDown } from "lucide-react";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function ImportHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        className={`${mono.className} p-10 text-center text-sm text-[#7C8A7A]`}
      >
        Loading history...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#16241C]">Import History</h2>

      <div className="grid gap-4">
        {history.map((item) => {
          const isOpen = expandedId === item._id;
          const detailRows = Object.entries(item).filter(
            ([key]) => !["_id", "records"].includes(key),
          );

          return (
            <div
              key={item._id}
              className="rounded-lg border border-[#D7DFCF] bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => toggle(item._id)}
                className="w-full flex justify-between items-center p-5 text-left focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2F6B4F]"
              >
                <div className="flex gap-4 items-center">
                  <div className="bg-[#EAF1E6] p-3 rounded-md">
                    <FileText className="text-[#2F6B4F]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#16241C]">
                      {item.fileName}
                    </h3>
                    <p className={`${mono.className} text-xs text-[#7C8A7A]`}>
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <div className="text-center">
                    <p className={`${mono.className} font-bold text-[#16241C]`}>
                      {item.importedRecords}
                    </p>
                    <span className="text-xs text-[#7C8A7A]">Imported</span>
                  </div>

                  <div className="text-center">
                    <p className={`${mono.className} font-bold text-[#16241C]`}>
                      {item.skippedRecords}
                    </p>
                    <span className="text-xs text-[#7C8A7A]">Skipped</span>
                  </div>

                  <span className="flex items-center gap-1 text-[#2F6B4F] bg-[#EAF1E6] px-3 py-1 rounded-full text-sm">
                    <CheckCircle size={15} />
                    {item.status}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`text-[#7C8A7A] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[#D7DFCF] bg-[#F7F9F4] p-5">
                  <table className={`${mono.className} w-full text-xs`}>
                    <tbody>
                      {detailRows.map(([key, value]) => (
                        <tr
                          key={key}
                          className="border-b border-[#E3E9DC] last:border-0"
                        >
                          <td className="py-2 pr-4 text-[#7C8A7A] uppercase tracking-wide w-40">
                            {key}
                          </td>
                          <td className="py-2 text-[#16241C]">
                            {String(value ?? "—")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {Array.isArray(item.records) && item.records.length > 0 && (
                    <div className="mt-4 overflow-auto max-h-64 border border-[#D7DFCF] rounded-md">
                      <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-[#EAF1E6]">
                          <tr>
                            {Object.keys(item.records[0]).map((h) => (
                              <th
                                key={h}
                                className={`${mono.className} p-2 text-left text-xs uppercase tracking-wide text-[#5B6B5F] border-b border-[#D7DFCF]`}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.records.map((row: any, i: number) => (
                            <tr
                              key={i}
                              className="odd:bg-white even:bg-[#F7F9F4]"
                            >
                              {Object.keys(item.records[0]).map((h) => (
                                <td
                                  key={h}
                                  className={`${mono.className} p-2 border-b border-[#E3E9DC] text-black`}
                                >
                                  {String(row[h] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
