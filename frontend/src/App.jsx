import "./style.css";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold">Employee Directory</h1>
            <nav className="space-x-3 text-sm text-gray-600">
              <Link to="/" className="hover:underline">
                Directory
              </Link>
              {role === "admin" && (
                <Link to="/admin/users" className="hover:underline">
                  Manage Users
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              {localStorage.getItem("userEmail")}
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 rounded bg-red-500 text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
