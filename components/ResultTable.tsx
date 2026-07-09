/* eslint-disable @typescript-eslint/no-explicit-any */
import { JetBrains_Mono } from "next/font/google";
import { CRMRecord } from "@/types/crm";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function ResultTable({ records }: { records: CRMRecord[] }) {
  if (!records.length) return null;

  const headers = Object.keys(records[0]);

  return (
    <div className="overflow-auto max-h-125 border border-[#D7DFCF] rounded-lg">
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
          {records.map((row, i) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-[#F7F9F4] hover:bg-[#EAF1E6] transition-colors"
            >
              {headers.map((h) => (
                <td
                  key={h}
                  className={`${mono.className} p-2 border-b border-[#E3E9DC] text-black`}
                >
                  {String((row as any)[h] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
