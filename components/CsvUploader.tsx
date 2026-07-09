"use client";

import { useDropzone } from "react-dropzone";
import { JetBrains_Mono } from "next/font/google";
import { UploadCloud } from "lucide-react";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

interface Props {
  onUpload: (file: File) => void;
}

export default function CsvUploader({ onUpload }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    onDrop(files) {
      if (files.length) {
        onUpload(files[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`rounded-md p-10 text-center cursor-pointer transition-colors ${
        isDragActive ? "bg-[#EAF1E6]" : "hover:bg-[#F7F9F4]"
      }`}
    >
      <input {...getInputProps()} />

      <UploadCloud
        className={`mx-auto mb-3 transition-transform ${
          isDragActive ? "text-[#2F6B4F] -translate-y-1" : "text-[#7C8A7A]"
        }`}
        size={32}
      />

      <h2 className="text-xl font-semibold text-[#16241C]">
        {isDragActive ? "Drop it" : "Drag & drop CSV"}
      </h2>

      <p className={`${mono.className} text-sm text-[#7C8A7A] mt-1`}>
        or click to select file
      </p>
    </div>
  );
}
