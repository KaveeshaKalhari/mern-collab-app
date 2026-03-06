import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Name is required";
        else if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
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
            await API.post("/auth/register", { name, email, password });
            toast.success("Account created! Please login");
            navigate("/login");
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed. Try again.";
            toast.error(msg);
            setErrors({ general: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Create Account
                </h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); }}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-400" : "border-gray-300"}`}
                        placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

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
                        placeholder="Min. 6 characters"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}