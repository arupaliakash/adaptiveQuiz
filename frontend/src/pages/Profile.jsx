import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {

  const navigate = useNavigate();

  const [pref, setPref] = useState({
    subject: "",
    difficulty: "",
    question_type: ""
  });

  const handleChange = (e) => {
    setPref({ ...pref, [e.target.name]: e.target.value });
  };

  const startQuiz = async () => {
    await fetch("http://127.0.0.1:5000/save-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
        subject: pref.subject,
        difficulty: pref.difficulty,
        question_type: pref.question_type
      })
    });

    navigate("/upload");
  };

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
    width: "320px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    background: "#4facfe",
    border: "none",
    color: "white",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>User Quiz Preferences</h2>

        <select name="subject" value={pref.subject} onChange={handleChange} style={inputStyle}>
          <option value="">Select Subject</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="AI">AI</option>
        </select>

        <select name="difficulty" value={pref.difficulty} onChange={handleChange} style={inputStyle}>
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select name="question_type" value={pref.question_type} onChange={handleChange} style={inputStyle}>
          <option value="">Select Question Type</option>
          <option value="MCQ">MCQ</option>
          <option value="True/False">True/False</option>
        </select>

        <button onClick={startQuiz} style={buttonStyle}>
         Upload Module
        </button>
      </div>
    </div>
  );
}

export default Profile;