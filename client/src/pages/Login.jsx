import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import toast from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = "Enter a valid email";
        if (!password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            const res = await API.post("/auth/login", { email, password });
            login(res.data.user, res.data.token);
            localStorage.setItem("token", res.data.token);
            toast.success(`Welcome back, ${res.data.user.name}!`);
            navigate("/dashboard");
        } catch (err) {
            toast.error("Invalid email or password");
            setErrors({ general: "Invalid email or password" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back
                </h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); }}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-400" : "border-gray-300"}`}
                        placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: "" }); }}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-400" : "border-gray-300"}`}
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}