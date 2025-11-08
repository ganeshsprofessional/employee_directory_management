import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      const me = await api.get("/users/me"); // requires admin - not ideal for employee; instead decode server not provided. We'll call employees endpoint to check minimal.

      localStorage.setItem("userEmail", email);
      if (me.data.role === "admin") localStorage.setItem("role", "admin");
      else if (me.data.role == "hr") localStorage.setItem("role", "hr");
      else localStorage.setItem("role", "employee");
      console.log(me);
      navigate("/");
    } catch (err) {
      setErr(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full px-3 py-2 border rounded"
          />
          <button className="w-full py-2 bg-blue-600 text-white rounded">
            Login
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-3">
          Use seeded accounts: admin@example.com / admin123 and hr@example.com /
          hr123456
        </div>
      </div>
    </div>
  );
}
