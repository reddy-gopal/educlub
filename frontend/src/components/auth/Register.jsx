import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const is_admin = role === "admin";

        const response = await fetch("http://127.0.0.1:8000/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email, is_admin }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Registration successful:", data);
            navigate("/");
        } else {
            const errorData = await response.json();
            console.error("Registration failed:", errorData);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 w-screen">
            <div className="bg-white shadow-lg border border-indigo-100 rounded-xl px-3 py-5  w-[250px] flex flex-col items-center justify-center transition-all duration-300">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="Register"
                    className="w-10 h-10 mb-1"
                />
                <h2 className="text-lg font-bold text-center text-indigo-700 mb-1">Create Account</h2>
                <p className="text-gray-500 text-center mb-3 text-xs">Join EduClub and start your journey!</p>
                <form onSubmit={handleSubmit} className="space-y-2 w-full">
                    <div className="flex flex-col items-center gap-2 mb-3">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-[70%] px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-[70%] px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-[70%] px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs"
                    />
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-1">
                        <label className="flex items-center space-x-1 text-xs">
                            <input
                                type="radio"
                                name="role"
                                value="user"
                                checked={role === "user"}
                                onChange={() => setRole("user")}
                                className="accent-indigo-600"
                            />
                            <span>User</span>
                        </label>
                        <label className="flex items-center space-x-1 text-xs">
                            <input
                                type="radio"
                                name="role"
                                value="admin"
                                checked={role === "admin"}
                                onChange={() => setRole("admin")}
                                className="accent-indigo-600"
                            />
                            <span>Admin</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 rounded text-xs transition mt-1"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <p className="text-gray-600 text-xs">
                        Already have an account?{" "}
                        <a href="/" className="text-indigo-600 hover:underline font-medium">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;