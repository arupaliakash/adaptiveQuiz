import React from "react";

const Dashboard = ({ user }) => {
  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Preferred Difficulty: {user.difficulty}</p>
      <p>Question Types: {user.questionTypes.join(", ")}</p>
    </div>
  );
};

export default Dashboard;