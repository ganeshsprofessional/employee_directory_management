import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function Employees() {
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const fetchDeps = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const params = {};
      if (q) params.q = q;
      if (department) params.department = department;
      if (minAge) params.min_age = minAge;
      if (maxAge) params.max_age = maxAge;
      const res = await api.get("/employees", { params });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeps();
    fetchEmployees();
  }, []);

  const search = (e) => {
    e?.preventDefault();
    fetchEmployees();
  };

  const del = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <form onSubmit={search} className="flex gap-3 items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, designation"
            className="px-3 py-2 border rounded w-96"
          />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            placeholder="Min age"
            className="px-3 py-2 border rounded w-24"
          />
          <input
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            placeholder="Max age"
            className="px-3 py-2 border rounded w-24"
          />
          <button className="px-3 py-2 bg-blue-600 text-white rounded">
            Search
          </button>
        </form>

        <div className="flex items-center gap-3">
          {(role === "hr" || role === "admin") && (
            <button
              onClick={() => navigate("/employees/new")}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Designation</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="px-4 py-3">{emp.full_name}</td>
                <td className="px-4 py-3">{emp.department_name}</td>
                <td className="px-4 py-3">{emp.designation}</td>
                <td className="px-4 py-3">{emp.age ?? "-"}</td>
                <td className="px-4 py-3">{emp.email}</td>
                <td className="px-4 py-3">
                  {role === "hr" || role === "admin" ? (
                    <>
                      <button
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                        className="mr-2 text-sm px-2 py-1 border rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => del(emp.id)}
                        className="text-sm px-2 py-1 border rounded text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-gray-600">View</span>
                  )}
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
