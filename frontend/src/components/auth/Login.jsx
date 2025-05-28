import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const response = await fetch("http://127.0.0.1:8000/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("is_admin", data.is_admin);
            navigate(data.is_admin ? "/admin/home" : "/home");
        } else {
            const errorData = await response.json();
            setError(errorData.detail || "Invalid credentials.");
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#304352] via-[#d7d2cc] to-indigo-100">
            <div className="bg-white shadow-2xl border border-indigo-100 rounded-2xl px-8 py-10 w-[250px] max-w-md transition-all duration-300 ">
                <h2 className="text-xl font-bold text-center text-black mb-6 animate-fade-in-down">
                    Welcome Back
                </h2>

                {error && (
                    <div className="mb-4 text-sm text-red-600 text-center animate-fade-in-up">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="animate-fade-in-up delay-200">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                        />
                    </div>
                    <div className="animate-fade-in-up delay-400">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                        />
                    </div>
                    <div className="animate-fade-in-up delay-600">
                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-sm transition transform hover:scale-105 active:scale-95 shadow"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center animate-fade-in-up delay-800">
                    <p className="text-sm text-gray-600">
                        New here?{" "}
                        <Link
                            to="/register"
                            className="text-black hover:text-indigo-800 font-medium transition-colors duration-300 underline-offset-2 hover:underline"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
