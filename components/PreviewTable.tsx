/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { JetBrains_Mono } from "next/font/google";
import { X, Upload, CheckCircle2, AlertCircle, RotateCw } from "lucide-react";
import VirtualizedTable from "./VirtualizedTable";

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
  const [toastMessage, setToastMessage] = useState("Import complete");
  const [toastType, setToastType] = useState<"success" | "error">("success");
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
      setToastType("success");
      setToastMessage("Import complete");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setIsOpen(false);
      }, 1400);
    } catch (error) {
      setToastType("error");
      setToastMessage(error instanceof Error ? error.message : "Import failed");
      setShowToast(true);
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
        .dark .scan-active {
          background-image: linear-gradient(
            110deg,
            #0f1712 40%,
            #d99a4e 50%,
            #0f1712 60%
          );
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
        }}
        onClick={() => !isImporting && setIsOpen(false)}
      >
        <div
          className="modal-in rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
          style={{
            backgroundColor: isDark ? "#16201A" : "#FFFFFF",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{
              borderColor: isDark ? "#2A362E" : "#D7DFCF",
            }}
          >
            <h2
              className={`${mono.className} text-sm uppercase tracking-wide`}
              style={{
                color: isDark ? "#8FA090" : "#5B6B5F",
              }}
            >
              Preview — {rows.length} rows
            </h2>
            <button
              onClick={() => !isImporting && setIsOpen(false)}
              disabled={isImporting}
              className="p-1.5 rounded-md transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2F6B4F]"
              style={{
                color: isDark ? "#8FA090" : "#7C8A7A",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark
                  ? "#1C271F"
                  : "#F7F9F4";
                e.currentTarget.style.color = isDark ? "#E7EDE2" : "#16241C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = isDark ? "#8FA090" : "#7C8A7A";
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-4">
            <VirtualizedTable
              headers={headers}
              rows={rows}
              maxHeight={420}
              rowHeight={40}
            />
          </div>

          <div
            className="flex justify-end gap-3 p-4 border-t"
            style={{
              borderColor: isDark ? "#2A362E" : "#D7DFCF",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              disabled={isImporting}
              className="px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-40"
              style={{
                color: isDark ? "#8FA090" : "#5B6B5F",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark
                  ? "#1C271F"
                  : "#F7F9F4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isImporting}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2F6B4F] disabled:cursor-not-allowed ${
                isImporting ? "scan-active" : ""
              }`}
              style={{
                backgroundColor: isImporting
                  ? undefined
                  : isDark
                    ? "#3F8C68"
                    : "#16241C",
              }}
              onMouseEnter={(e) => {
                if (!isImporting) {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "#4CA378"
                    : "#2F6B4F";
                }
              }}
              onMouseLeave={(e) => {
                if (!isImporting) {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "#3F8C68"
                    : "#16241C";
                }
              }}
            >
              {!isImporting && <Upload size={15} />}
              {isImporting ? "AI Processing..." : "Confirm Import"}
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div
          className="toast-in fixed bottom-6 right-6 z-60 flex items-center gap-2 px-4 py-3 rounded-md shadow-lg"
          style={{
            backgroundColor:
              toastType === "success"
                ? isDark
                  ? "#3F8C68"
                  : "#16241C"
                : isDark
                  ? "#8B2E2E"
                  : "#C62828",
            color: "#FFFFFF",
          }}
        >
          {toastType === "success" ? (
            <CheckCircle2 size={16} style={{ color: "#7FD99F" }} />
          ) : (
            <AlertCircle size={16} style={{ color: "#FF9A9A" }} />
          )}
          <span className="text-sm">{toastMessage}</span>
          {toastType === "error" && (
            <button
              onClick={() => {
                setShowToast(false);
                handleConfirm();
              }}
              className="ml-2 p-1 rounded hover:bg-white/20 transition-colors"
            >
              <RotateCw size={14} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
