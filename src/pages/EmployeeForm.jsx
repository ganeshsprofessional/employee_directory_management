import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department_id: "",
    designation: "",
    date_of_birth: "",
    date_of_joining: "",
    gender: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    api
      .get("/departments")
      .then((r) => setDepartments(r.data))
      .catch(() => {});
    if (id) {
      api.get(`/employees/${id}`).then((r) => {
        const e = r.data;
        setForm({
          first_name: e.first_name || "",
          last_name: e.last_name || "",
          email: e.email || "",
          phone: e.phone || "",
          department_id: e.department_id || "",
          designation: e.designation || "",
          date_of_birth: e.date_of_birth || "",
          date_of_joining: e.date_of_joining || "",
          gender: e.gender || "",
          address: e.address || "",
          notes: e.notes || "",
        });
      });
    }
  }, []);

  const handle = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.patch(`/employees/${id}`, form);
      } else {
        await api.post("/employees", form);
      }
      navigate("/");
    } catch (err) {
      alert("Save failed");
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">{id ? "Edit" : "Add"} Employee</h2>
      <form onSubmit={submit} className="space-y-3">
        <div className="flex gap-3">
          <input
            value={form.first_name}
            onChange={(e) => handle("first_name", e.target.value)}
            placeholder="First name"
            className="flex-1 px-3 py-2 border rounded"
            required
          />
          <input
            value={form.last_name}
            onChange={(e) => handle("last_name", e.target.value)}
            placeholder="Last name"
            className="flex-1 px-3 py-2 border rounded"
          />
        </div>
        <div className="flex gap-3">
          <input
            value={form.email}
            onChange={(e) => handle("email", e.target.value)}
            placeholder="Email"
            className="flex-1 px-3 py-2 border rounded"
          />
          <input
            value={form.phone}
            onChange={(e) => handle("phone", e.target.value)}
            placeholder="Phone"
            className="flex-1 px-3 py-2 border rounded"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={form.department_id}
            onChange={(e) => handle("department_id", e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option value={d.id} key={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            value={form.designation}
            onChange={(e) => handle("designation", e.target.value)}
            placeholder="Designation"
            className="flex-1 px-3 py-2 border rounded"
          />
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={form.date_of_birth}
            onChange={(e) => handle("date_of_birth", e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <input
            type="date"
            value={form.date_of_joining}
            onChange={(e) => handle("date_of_joining", e.target.value)}
            className="px-3 py-2 border rounded"
          />
        </div>
        <div>
          <textarea
            value={form.address}
            onChange={(e) => handle("address", e.target.value)}
            placeholder="Address"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-3 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
