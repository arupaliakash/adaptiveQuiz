import React from "react";

const Admin = ({ contentList }) => (
  <div>
    <h2>Admin Dashboard</h2>
    <table>
      <thead>
        <tr>
          <th>Content</th>
          <th>Questions</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {contentList.map((item) => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.questionCount}</td>
            <td>{item.status}</td>
            <td><button>Review</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Admin;