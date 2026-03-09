import { useState } from "react";
import { getQuiz } from "../services/api";

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);

  const fetchQuiz = async () => {
    const userId = localStorage.getItem("user_id");
    const res = await getQuiz(userId);
    const data = res.data;
    setQuestions(Array.isArray(data) ? data : data.questions || []);
  };

  const gradeLocally = (answers) => {
    if (!questions.length) return 0;
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] && q.answer && String(answers[idx]).trim() === String(q.answer).trim()) {
        correct += 1;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  return { questions, fetchQuiz, gradeLocally };
};