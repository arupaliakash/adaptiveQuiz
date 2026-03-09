import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, listFiles, downloadFileUrl, deleteFile } from "../services/api";

function Upload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const containerStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(120deg, #4facfe, #00f2fe)",
    fontFamily: "Arial, sans-serif"
  };

  const boxStyle = {
    background: "white",
    padding: "35px",
    borderRadius: "10px",
    width: "480px",
    maxHeight: "90vh",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column"
  };

  const uploadAreaStyle = {
    border: "2px dashed #4facfe",
    borderRadius: "8px",
    padding: "25px",
    marginTop: "10px",
    background: "#f7fbff"
  };

  const iconStyle = {
    fontSize: "40px",
    color: "#4facfe",
    marginBottom: "10px"
  };

  const textStyle = {
    marginBottom: "15px",
    color: "#555",
    fontSize: "15px"
  };

  const buttonStyle = {
    background: "#4facfe",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px"
  };

  const fileInputStyle = {
    display: "none"
  };

  const listContainerStyle = {
    marginTop: "20px",
    textAlign: "left",
    overflowY: "auto"
  };

  const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
    fontSize: "14px"
  };

  const linkButtonStyle = {
    ...buttonStyle,
    padding: "6px 12px",
    fontSize: "12px",
    background: "#00b894"
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    padding: "6px 12px",
    fontSize: "12px",
    background: "#e74c3c",
    marginLeft: "8px"
  };

  const startQuizButtonStyle = {
    ...buttonStyle,
    background: "#6c5ce7",
    width: "100%",
    marginTop: "16px"
  };

  const statusTextStyle = {
    marginTop: "10px",
    fontSize: "13px",
    color: "#333"
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file || null);
    setMessage(file ? `Selected: ${file.name}` : "");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("Uploading...");
      await uploadFile(selectedFile);
      setMessage("File uploaded successfully.");
      setSelectedFile(null);
      await fetchFiles();
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await listFiles();
      setFiles(response.data.files || []);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load files.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>Upload Learning Material</h2>

        <div style={uploadAreaStyle}>
          <div style={iconStyle}>☁️</div>

          <div style={textStyle}>
            Upload learning material (PDF, DOCX, etc.)
          </div>

          <label style={buttonStyle}>
            Choose File
            <input type="file" style={fileInputStyle} onChange={handleFileChange} />
          </label>

          <div style={statusTextStyle}>
            {message || "No file selected."}
          </div>

          <button
            style={{ ...buttonStyle, marginTop: "10px", opacity: uploading ? 0.7 : 1 }}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <div style={listContainerStyle}>
          <h3>Uploaded Files</h3>
          {files.length === 0 && (
            <div style={{ fontSize: "13px", color: "#777" }}>No files uploaded yet.</div>
          )}
          {files.map((file) => (
            <div key={file} style={listItemStyle}>
              <span>{file}</span>
              <div>
                <a
                  href={downloadFileUrl(file)}
                  style={linkButtonStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
                <button
                  style={deleteButtonStyle}
                  onClick={async () => {
                    try {
                      await deleteFile(file);
                      await fetchFiles();
                    } catch (err) {
                      console.error(err);
                      setMessage("Failed to delete file.");
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          style={startQuizButtonStyle}
          onClick={() => navigate("/quiz")}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default Upload;