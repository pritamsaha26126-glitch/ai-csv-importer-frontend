/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { JetBrains_Mono, Inter } from "next/font/google";

import CsvUploader from "@/components/CsvUploader";
import PreviewTable from "@/components/PreviewTable";
import ResultTable from "@/components/ResultTable";
import ImportHistory from "@/components/ImportHistory";
import { importCSV } from "@/services/api";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// const STATS = [
//   { ref: "A1", label: "Total Imports", value: "24" },
//   { ref: "B1", label: "AI Processed Leads", value: "1,240" },
//   { ref: "C1", label: "Accuracy", value: "98%" },
// ];

function CellLabel({ text }: { text: string }) {
  return (
    <span
      className={`${mono.className} absolute -top-2.5 left-4 bg-[#EFF2EA] px-1.5 text-[10px] tracking-widest text-[#7C8A7A]`}
    >
      {text}
    </span>
  );
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

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
      className={`${sans.className} min-h-screen bg-[#EFF2EA] p-6 md:p-10`}
      style={{
        backgroundImage:
          "linear-gradient(#DEE5D6 1px, transparent 1px), linear-gradient(90deg, #DEE5D6 1px, transparent 1px)",
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
              className={`${mono.className} text-[11px] tracking-[0.25em] text-[#2F6B4F] mb-2`}
            >
              SHEET → CRM
            </div>
            <h1 className="text-4xl font-bold text-[#16241C] tracking-tight">
              GrowEasy CSV Importer
            </h1>
            <p className="text-[#5B6B5F] mt-1">
              Upload a CSV. AI maps every column. Clean leads land in your CRM.
            </p>
          </div>
        </div>

        {/* <div className="grid md:grid-cols-3 gap-5">
          {STATS.map((s, i) => (
            <div
              key={s.ref}
              className="rise-in relative bg-white rounded-lg p-6 border border-[#D7DFCF] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <CellLabel text={s.ref} />
              <h3 className="text-sm text-[#5B6B5F]">{s.label}</h3>
              <p
                className={`${mono.className} text-3xl font-bold text-[#16241C] mt-1`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div> */}

        <div className="relative bg-white rounded-lg p-8 border-2 border-dashed border-[#B9C6AF]">
          <CellLabel text="A1 — drop file" />
          <CsvUploader onUpload={handleFile} />
        </div>

        <PreviewTable rows={preview} onConfirm={confirmImport} />

        {records.length > 0 && (
          <div className="rise-in relative bg-white rounded-lg p-6 border border-[#D7DFCF] shadow-sm">
            <CellLabel text="C1 — mapped" />
            <ResultTable records={records} />
          </div>
        )}

        <div className="relative bg-white rounded-lg p-8 border border-[#D7DFCF] shadow-sm">
          <CellLabel text="D1 — history" />
          <ImportHistory />
        </div>
      </div>
    </div>
  );
}
