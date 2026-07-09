/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { JetBrains_Mono } from "next/font/google";
import { X, Upload, CheckCircle2 } from "lucide-react";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface Props {
  rows: any[];
  onConfirm: () => Promise<void>;
}

export default function PreviewTable({ rows, onConfirm }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (rows.length) setIsOpen(true);
  }, [rows]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isImporting) setIsOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isImporting]);

  async function handleConfirm() {
    setIsImporting(true);

    try {
      await onConfirm();
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setIsOpen(false);
      }, 1400);
    } finally {
      setIsImporting(false);
    }
  }

  if (!rows.length || !isOpen) return null;

  const headers = Object.keys(rows[0]);

  return (
    <>
      <style jsx global>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scanline {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .modal-in {
          animation: modalIn 0.18s ease-out both;
        }
        .toast-in {
          animation: toastIn 0.18s ease-out both;
        }
        .scan-active {
          background-image: linear-gradient(
            110deg,
            #16241c 40%,
            #c6862f 50%,
            #16241c 60%
          );
          background-size: 200% 100%;
          animation: scanline 1.4s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .modal-in,
          .toast-in,
          .scan-active {
            animation: none;
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        onClick={() => !isImporting && setIsOpen(false)}
      >
        <div
          className="modal-in bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-[#D7DFCF]">
            <h2
              className={`${mono.className} text-sm uppercase tracking-wide text-[#5B6B5F]`}
            >
              Preview — {rows.length} rows
            </h2>
            <button
              onClick={() => !isImporting && setIsOpen(false)}
              disabled={isImporting}
              className="p-1.5 rounded-md text-[#7C8A7A] hover:bg-[#F7F9F4] hover:text-[#16241C] transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2F6B4F]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-auto flex-1">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-[#EAF1E6]">
                <tr>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className={`${mono.className} p-3 border-b border-[#D7DFCF] text-left text-xs uppercase tracking-wide text-[#5B6B5F]`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="odd:bg-white even:bg-[#F7F9F4] hover:bg-[#EAF1E6] transition-colors"
                  >
                    {headers.map((h) => (
                      <td
                        key={h}
                        className={`${mono.className} p-2 border-b border-[#E3E9DC] text-black`}
                      >
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t border-[#D7DFCF]">
            <button
              onClick={() => setIsOpen(false)}
              disabled={isImporting}
              className="px-4 py-2 rounded-md text-sm text-[#5B6B5F] hover:bg-[#F7F9F4] transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isImporting}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2F6B4F] disabled:cursor-not-allowed ${
                isImporting ? "scan-active" : "bg-[#16241C] hover:bg-[#2F6B4F]"
              }`}
            >
              {!isImporting && <Upload size={15} />}
              {isImporting ? "AI Processing..." : "Confirm Import"}
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast-in fixed bottom-6 right-6 z-60 flex items-center gap-2 bg-[#16241C] text-white px-4 py-3 rounded-md shadow-lg">
          <CheckCircle2 size={16} className="text-[#7FD99F]" />
          <span className="text-sm">Import complete</span>
        </div>
      )}
    </>
  );
}
