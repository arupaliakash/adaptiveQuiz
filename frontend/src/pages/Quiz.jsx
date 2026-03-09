import React, { useEffect, useState } from "react";
import { useQuiz } from "../hooks/useQuiz";

const QuizPage = () => {
  const { questions, fetchQuiz, gradeLocally } = useQuiz();
  const [score, setScore] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    fetchQuiz();
  }, []);

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
    padding: "30px 40px",
    borderRadius: "12px",
    width: "650px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  };

  const badgeStyle = {
    background: "#4facfe",
    color: "white",
    borderRadius: "20px",
    padding: "6px 14px",
    fontSize: "13px"
  };

  const scoreBadgeStyle = {
    ...badgeStyle,
    background: "#00b894"
  };

  const progressBarOuter = {
    marginTop: "10px",
    height: "6px",
    borderRadius: "3px",
    background: "#eee",
    overflow: "hidden"
  };

  const progressBarInner = (percent) => ({
    width: `${percent}%`,
    height: "100%",
    background: "linear-gradient(90deg, #4facfe, #00f2fe)"
  });

  const questionCardStyle = {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "10px",
    background: "#f7fbff"
  };

  const optionStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    marginTop: "8px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: active ? "2px solid #4facfe" : "1px solid #ddd",
    background: active ? "#e8f4ff" : "white",
    cursor: "pointer",
    fontSize: "14px"
  });

  const optionInputStyle = {
    marginRight: "8px"
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px"
  };

  const navButtonStyle = (primary) => ({
    padding: "10px 18px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    color: primary ? "white" : "#4facfe",
    background: primary ? "#4facfe" : "white",
    boxShadow: primary ? "0 3px 8px rgba(0,0,0,0.15)" : "none"
  });

  if (!questions.length) {
    return (
      <div style={containerStyle}>
        <div style={boxStyle}>
          <h2>Loading quiz...</h2>
        </div>
      </div>
    );
  }

  const total = questions.length;
  const current = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / total) * 100;

  const handleOptionChange = (idx, value) => {
    setSelectedAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const goPrev = () => {
    setCurrentIndex((idx) => Math.max(0, idx - 1));
  };

  const goNext = () => {
    setCurrentIndex((idx) => Math.min(total - 1, idx + 1));
  };

  const handleFinalSubmit = () => {
    const answersArray = questions.map((_, idx) => selectedAnswers[idx] || null);
    const resultScore = gradeLocally(answersArray);
    setScore(resultScore);
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div style={headerStyle}>
          <div>
            <h3>Adaptive Quiz</h3>
            <div style={progressBarOuter}>
              <div style={progressBarInner(progressPercent)} />
            </div>
          </div>
          <div>
            <span style={badgeStyle}>
              Question {currentIndex + 1} of {total}
            </span>
            {score !== null && (
              <span style={{ ...scoreBadgeStyle, marginLeft: "8px" }}>
                Score: {score}%
              </span>
            )}
          </div>
        </div>

        <div style={questionCardStyle}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>{current.question}</p>
          {current.options && current.options.length > 0 ? (
            current.options.map((opt, i) => {
              const isActive = selectedAnswers[currentIndex] === opt;
              return (
                <label key={i} style={optionStyle(isActive)}>
                  <input
                    type="radio"
                    style={optionInputStyle}
                    name={`answer_${currentIndex}`}
                    value={opt}
                    checked={isActive}
                    onChange={() => handleOptionChange(currentIndex, opt)}
                  />
                  {opt}
                </label>
              );
            })
          ) : (
            <p style={{ fontSize: "14px", color: "#666" }}>
              (No options available for this question.)
            </p>
          )}
        </div>

        <div style={footerStyle}>
          <button
            style={navButtonStyle(false)}
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          {currentIndex < total - 1 ? (
            <button
              style={navButtonStyle(true)}
              onClick={goNext}
              disabled={!selectedAnswers[currentIndex]}
            >
              Next Question
            </button>
          ) : (
            <button
              style={navButtonStyle(true)}
              onClick={handleFinalSubmit}
              disabled={!selectedAnswers[currentIndex]}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
