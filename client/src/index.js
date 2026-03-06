import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <Toaster
            position="top-right"
            toastOptions={{
                success: {
                    duration: 3000,
                    style: {
                        background: "#f0fdf4",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                    },
                },
                error: {
                    duration: 4000,
                    style: {
                        background: "#fef2f2",
                        color: "#991b1b",
                        border: "1px solid #fecaca",
                    },
                },
            }}
        />
        <App />
    </AuthProvider>
);