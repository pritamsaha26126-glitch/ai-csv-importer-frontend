/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { JetBrains_Mono } from "next/font/google";
import { UploadCloud } from "lucide-react";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

interface Props {
  onUpload: (file: File) => void;
}

export default function CsvUploader({ onUpload }: Props) {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    onDrop(files) {
      if (files.length) onUpload(files[0]);
    },
  });

  const styles = {
    container: {
      backgroundColor: isDragActive
        ? isDark
          ? "#1C271F"
          : "#FFFFFF"
        : isDark
          ? "#16201A"
          : "#FFFFFF",
      transition: "all 0.3s ease",
    },
    icon: {
      color: isDragActive
        ? isDark
          ? "#4CA378"
          : "#2F6B4F"
        : isDark
          ? "#8FA090"
          : "#7C8A7A",
    },
    title: {
      color: isDark ? "#E7EDE2" : "#16241C",
    },
    subtitle: {
      color: isDark ? "#8FA090" : "#7C8A7A",
    },
  };

  return (
    <div
      {...getRootProps()}
      className="rounded-md p-10 text-center cursor-pointer hover:bg-[#F7F9F4] dark:hover:bg-[#1C271F]"
      style={styles.container}
    >
      <input {...getInputProps()} />

      <UploadCloud
        className={`mx-auto mb-3 transition-transform ${
          isDragActive ? "-translate-y-1" : ""
        }`}
        style={styles.icon}
        size={32}
      />

      <h2 className="text-xl font-semibold" style={styles.title}>
        {isDragActive ? "Drop it" : "Drag & drop CSV"}
      </h2>

      <p className={`${mono.className} text-sm mt-1`} style={styles.subtitle}>
        or click to select file
      </p>
    </div>
  );
}
