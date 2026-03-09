import React from "react";

const QuizUI = ({ questions, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      {questions.map((q, idx) => (
        <div key={idx} className="quiz-card">
          <p>{q.question}</p>
          {q.options.map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name={`answer_${idx}`}
                value={opt}
                required
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button type="submit">Submit Quiz</button>
    </form>
  );
};

export default QuizUI;