"use client";

import { createContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/token/`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;
      localStorage.setItem("access_token", response.data.access_token);
      setUser(response.data);
      router.push("/");
    } catch (error) {
      console.error("Login failed");
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/`,
        { username, password }
      );
      router.push("/login");
    } catch (error) {
      console.error("Signup error");
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("access_token");
      router.push("/login");
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
