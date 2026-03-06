import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function Dashboard() {
    const [documents, setDocuments] = useState([]);
    const [title, setTitle] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await API.get("/documents");
            setDocuments(res.data);
        } catch (err) {
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    const createDocument = async () => {
        if (!title.trim()) {
            toast.error("Please enter a document title");
            return;
        }
        if (title.trim().length < 3) {
            toast.error("Title must be at least 3 characters");
            return;
        }
        try {
            const res = await API.post("/documents", { title, content: "" });
            toast.success("Document created! 📄");
            setTitle("");
            navigate(`/document/${res.data._id}`);
        } catch (err) {
            toast.error("Failed to create document");
        }
    };

    const deleteDocument = async (docId) => {
        try {
            await API.delete(`/documents/${docId}`);
            setDocuments(documents.filter((d) => d._id !== docId));
            toast.success("Document deleted");
            setDeleteConfirm(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete document");
        }
    };

    const searchDocuments = async () => {
        if (!search.trim()) return fetchDocuments();
        try {
            const res = await API.get(`/documents/search?q=${search}`);
            setDocuments(res.data);
            if (res.data.length === 0) toast("No documents found 🔍", { icon: "ℹ️" });
        } catch (err) {
            toast.error("Search failed");
        }
    };

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">📝 CollabDocs</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">Hi, {user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto p-6">
                {/* Create Document */}
                <div className="bg-white rounded-lg shadow p-5 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">
                        Create New Document
                    </h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && createDocument()}
                            placeholder="Document title..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={createDocument}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            + Create
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchDocuments()}
                        placeholder="Search documents..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={searchDocuments}
                        className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        Search
                    </button>
                    {search && (
                        <button
                            onClick={() => { setSearch(""); fetchDocuments(); }}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Documents List */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 mt-3">Loading documents...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center text-gray-400 py-16">
                        <p className="text-4xl mb-3">📄</p>
                        <p className="text-lg">No documents yet. Create one above!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {documents.map((doc) => (
                            <div
                                key={doc._id}
                                className="bg-white rounded-lg shadow p-5 border border-transparent hover:border-blue-400 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">
                                    {/* Clickable area */}
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() => navigate(`/document/${doc._id}`)}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {doc.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Collaborators: {doc.collaborators?.length || 0}
                                        </p>
                                    </div>

                                    {/* Delete button */}
                                    {deleteConfirm === doc._id ? (
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => deleteDocument(doc._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(doc._id)}
                                            className="ml-4 text-gray-800 hover:text-red-500 transition p-1 rounded hover:bg-red-50"
                                            title="Delete document"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}