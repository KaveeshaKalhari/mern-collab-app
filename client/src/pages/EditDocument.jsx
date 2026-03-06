import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import API from "../api";

export default function EditDocument() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [collaboratorEmail, setCollaboratorEmail] = useState("");
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
    });

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const res = await API.get(`/documents/${id}`);
                setTitle(res.data.title);
                editor?.commands.setContent(res.data.content || "");
            } catch (err) {
                console.error(err);
            }
        };
        if (editor) fetchDoc();
    }, [id, editor]);

    const saveDocument = async () => {
        setSaving(true);
        try {
            await API.put(`/documents/${id}`, {
                title,
                content: editor.getHTML(),
            });
            setMessage("✅ Saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("❌ Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    const addCollaborator = async () => {
        if (!collaboratorEmail.trim()) return;
        try {
            await API.post(`/documents/${id}/collaborators`, {
                email: collaboratorEmail,
            });
            setMessage("✅ Collaborator added!");
            setCollaboratorEmail("");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("❌ User not found or already added.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-blue-600 hover:underline text-sm"
                >
                    ← Back to Dashboard
                </button>
                <button
                    onClick={saveDocument}
                    disabled={saving}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </nav>

            <div className="max-w-4xl mx-auto p-6">
                {message && (
                    <p className="bg-blue-50 text-blue-700 p-3 rounded-lg mb-4 text-sm">
                        {message}
                    </p>
                )}

                {/* Title */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-3xl font-bold border-none outline-none bg-transparent mb-4 text-gray-800"
                    placeholder="Document Title..."
                />

                {/* Editor Toolbar */}
                <div className="bg-white rounded-t-lg border border-gray-200 px-4 py-2 flex gap-2 flex-wrap">
                    <button onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`px-3 py-1 rounded text-sm font-bold ${editor?.isActive("bold") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
                        B
                    </button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`px-3 py-1 rounded text-sm italic ${editor?.isActive("italic") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
                        I
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`px-3 py-1 rounded text-sm ${editor?.isActive("heading", { level: 1 }) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
                        H1
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`px-3 py-1 rounded text-sm ${editor?.isActive("heading", { level: 2 }) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
                        H2
                    </button>
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`px-3 py-1 rounded text-sm ${editor?.isActive("bulletList") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
                        • List
                    </button>
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`px-3 py-1 rounded text-sm ${editor?.isActive("orderedList") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
                        1. List
                    </button>
                    <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            className={`px-3 py-1 rounded text-sm ${editor?.isActive("codeBlock") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
                        {"</>"}
                    </button>
                </div>

                {/* Editor Content */}
                <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 min-h-64 prose max-w-none">
                    <EditorContent editor={editor} />
                </div>

                {/* Collaborator Management */}
                <div className="bg-white rounded-lg shadow p-5 mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                        👥 Add Collaborator
                    </h3>
                    <div className="flex gap-3">
                        <input
                            type="email"
                            value={collaboratorEmail}
                            onChange={(e) => setCollaboratorEmail(e.target.value)}
                            placeholder="Enter collaborator's email..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={addCollaborator}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}