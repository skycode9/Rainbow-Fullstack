import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Trash2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { contactAPI } from "../../services/api";

export default function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactAPI.getAll();
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await contactAPI.delete(id);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete message");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactAPI.markAsRead(id);
      setContacts(
        contacts.map((c) => (c._id === id ? { ...c, status: "read" } : c))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Mail size={24} />
                  Contact Messages
                </h1>
                <p className="text-gray-400 text-sm">
                  View and manage messages
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <Mail size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-gray-900 rounded-xl border ${
                  contact.status === "pending"
                    ? "border-blue-500"
                    : "border-gray-800"
                } p-6 hover:border-white transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{contact.name}</h3>
                      {contact.status === "pending" && (
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-semibold">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{contact.email}</p>
                    {contact.phone && (
                      <p className="text-gray-400 text-sm">{contact.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {contact.status !== "read" && (
                      <button
                        onClick={() => handleMarkAsRead(contact._id)}
                        className="p-2 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    {contact.status === "read" && (
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full">
                        Read
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {contact.message}
                  </p>
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
