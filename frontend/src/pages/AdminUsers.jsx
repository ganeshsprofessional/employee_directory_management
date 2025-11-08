import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: "employee",
  });

  const fetch = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users. Make sure you are admin.");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users", form);
      alert(`User created. Temp password: ${res.data.tempPassword}`);
      setForm({ email: "", full_name: "", phone: "", role: "employee" });
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Create user</h3>
        <form onSubmit={submit} className="flex gap-2">
          <input
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="px-2 py-1 border rounded"
          />
          <input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Full name"
            className="px-2 py-1 border rounded"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="px-2 py-1 border rounded"
          >
            <option value="employee">employee</option>
            <option value="hr">hr</option>
          </select>
          <button className="px-3 py-1 bg-green-600 text-white rounded">
            Create
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Users</h3>
        <table className="min-w-full">
          <thead className="text-left text-sm text-gray-600">
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.full_name}</td>
                <td className="py-2">{u.phone}</td>
                <td className="py-2">{u.role}</td>
                <td className="py-2">{u.is_active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
