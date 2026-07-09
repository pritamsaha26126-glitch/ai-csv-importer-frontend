/* eslint-disable @typescript-eslint/no-explicit-any */
import { CRMRecord } from "@/types/crm";
import VirtualizedTable from "./VirtualizedTable";

export default function ResultTable({ records }: { records: CRMRecord[] }) {
  if (!records.length) return null;

  const headers = Object.keys(records[0]);

  return (
    <VirtualizedTable
      headers={headers}
      rows={records as any[]}
      maxHeight={500}
      rowHeight={40}
    />
  );
}
