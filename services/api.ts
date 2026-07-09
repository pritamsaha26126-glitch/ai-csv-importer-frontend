import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const importCSV = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await api.post("/api/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getHistory = async () => {
  const res = await api.get("/api/import/history");

  return res.data;
};
