import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

export const login = (data) => API.post("/auth/login", data);

export const register = (data) => API.post("/auth/register", data);

export const getQuiz = (userId) =>
  API.get("/quiz/generate", {
    params: userId ? { user_id: userId } : {}
  });

export const submitQuiz = (answers) =>
  API.post("/quiz/submit", { answers });

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const listFiles = () => API.get("/files");

export const downloadFileUrl = (filename) =>
  `${API.defaults.baseURL}/files/${encodeURIComponent(filename)}`;

export const deleteFile = (filename) =>
  API.delete(`/files/${encodeURIComponent(filename)}`);