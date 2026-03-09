import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validation function
  const validateForm = () => {
    const { email, username, password } = form;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setMessage("Invalid email format");
    return false;
  }

    // Username validation
    if (username.length < 3) {
      setMessage("Username must be at least 3 characters");
      return false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be at least 6 characters, include 1 uppercase letter and 1 number"
      );
      return false;
    }

    setMessage(""); // clear previous errors
    return true;
  };

  // LOGIN FUNCTION
  const handleLogin = async (data) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setMessage(result.message);

      if (res.ok) {
        alert("Login Successful");
        localStorage.setItem("user_id", result.data.user_id);
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  // REGISTER FUNCTION
  const handleRegister = async (data) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setMessage(result.message);

      if (res.ok) {
        alert("Account Created Successfully");
        setForm({ email: "", username: "", password: "" });
        setIsSignup(false); // switch to login
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? "Create Account" : "Login"}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!validateForm()) return; // run validations
            isSignup ? handleRegister(form) : handleLogin(form);
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>

        <p className="switch-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Sign Up"}
          </span>
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginForm;