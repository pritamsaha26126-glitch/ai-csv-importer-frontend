/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { JetBrains_Mono, Inter } from "next/font/google";

import CsvUploader from "@/components/CsvUploader";
import PreviewTable from "@/components/PreviewTable";
import ResultTable from "@/components/ResultTable";
import ImportHistory from "@/components/ImportHistory";
import ThemeToggle from "@/components/ThemeToggle";
import { importCSV } from "@/services/api";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function CellLabel({ text }: { text: string }) {
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

  return (
    <span
      className={`${mono.className} absolute -top-2.5 left-4 px-1.5 text-[10px] tracking-widest`}
      style={{
        backgroundColor: isDark ? "#16201A" : "#EFF2EA",
        color: isDark ? "#8FA090" : "#7C8A7A",
      }}
    >
      {text}
    </span>
  );
}
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
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

  function handleFile(file: File) {
    setFile(file);

    import("papaparse").then(({ default: Papa }) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete(result) {
          setPreview(result.data as any[]);
        },
      });
    });
  }

  async function confirmImport() {
    if (!file) return;

    const data = await importCSV(file);
    setRecords(data.records);
  }

  return (
    <div
      className={`${sans.className} min-h-screen p-6 md:p-10 transition-colors duration-300  backgroundImage:
          "linear-gradient(#DEE5D6 1px, transparent 1px), linear-gradient(90deg, #DEE5D6 1px, transparent 1px)",`}
      style={{
        backgroundColor: isDark ? "#0F1712" : "#EFF2EA",
        backgroundImage: isDark
          ? "linear-gradient(#1c271f 1px, transparent 1px), linear-gradient(90deg, #1c271f 1px, transparent 1px)"
          : "linear-gradient(#DEE5D6 1px, transparent 1px), linear-gradient(90deg, #DEE5D6 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        backgroundPosition: "-1px -1px",
      }}
    >
      <style jsx global>{`
        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .rise-in {
          animation: riseIn 0.5s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .rise-in {
            animation: none;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rise-in flex items-start justify-between flex-wrap gap-4">
          <div>
            <div
              className={`${mono.className} text-[11px] tracking-[0.25em] text-[#2F6B4F] dark:text-[#4CA378] mb-2`}
            >
              SHEET → CRM
            </div>
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{
                color: isDark ? "#E7EDE2" : "#16241C",
              }}
            >
              GrowEasy CSV Importer
            </h1>
            <p className="text-[#5B6B5F] dark:text-[#8FA090] mt-1">
              Upload a CSV. AI maps every column. Clean leads land in your CRM.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <ThemeToggle />
          </div>
        </div>

        <div
          className="relative rounded-lg p-8 border-2 border-dashed"
          style={{
            backgroundColor: isDark ? "#16201A" : "#FFFFFF",
            borderColor: isDark ? "#2A362E" : "#B9C6AF",
          }}
        >
          <CellLabel text="A1 — drop file" />
          <CsvUploader onUpload={handleFile} />
        </div>

        <PreviewTable rows={preview} onConfirm={confirmImport} />

        {records.length > 0 && (
          <div
            className="rise-in relative bg-white dark:bg-[#16201A] rounded-lg p-6 border border-[#D7DFCF] dark:border-[#2A362E] shadow-sm"
            style={{
              backgroundColor: isDark ? "#16201A" : "#FFFFFF",
              borderColor: isDark ? "#2A362E" : "#B9C6AF",
            }}
          >
            <CellLabel text="C1 — mapped" />
            <ResultTable records={records} />
          </div>
        )}

        <div
          className="relative bg-white dark:bg-[#16201A] rounded-lg p-8 border border-[#D7DFCF] dark:border-[#2A362E] shadow-sm"
          style={{
            backgroundColor: isDark ? "#16201A" : "#FFFFFF",
            borderColor: isDark ? "#2A362E" : "#B9C6AF",
          }}
        >
          <CellLabel text="D1 — history" />
          <ImportHistory />
        </div>
      </div>
    </div>
  );
}
