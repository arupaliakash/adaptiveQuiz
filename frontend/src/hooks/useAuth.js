import { useState } from "react";
import { login, register } from "../services/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async (form) => {
    const res = await login(form);
    setUser(res.data.user);
  };

  const handleRegister = async (form) => {
    const res = await register(form);
    setUser(res.data.user);
  };

  return { user, handleLogin, handleRegister };
};