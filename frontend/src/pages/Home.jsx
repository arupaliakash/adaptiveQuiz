import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div>
    <h1>Adaptive Quiz Generator</h1>
    <nav>
      <Link to="/login">Login</Link> | 
      <Link to="/profile">Profile</Link> | 
      <Link to="/quiz">Take Quiz</Link> | 
      <Link to="/admin">Admin</Link>
    </nav>
    <p>Upload content and generate personalized quizzes using NLP + Transformers.</p>
  </div>
);

export default Home;