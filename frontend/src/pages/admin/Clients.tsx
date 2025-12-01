import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clientsAPI } from "../../services/api";
import { getImageUrl } from "../../utils/config";

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      await clientsAPI.delete(id);
      setClients(clients.filter((client) => client._id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete client");
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
                  <Building2 size={24} />
                  Clients Management
                </h1>
                <p className="text-gray-400 text-sm">Manage your clients</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/clients/create")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              <Plus size={20} />
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-gray-400">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-4">No clients found</p>
            <button
              onClick={() => navigate("/admin/clients/create")}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Add Your First Client
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-white transition-all duration-300"
              >
                <div className="aspect-square bg-gray-800 relative overflow-hidden rounded-lg mb-3">
                  {client.logo ? (
                    <img
                      src={getImageUrl(client.logo)}
                      alt={client.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 size={32} className="text-gray-600" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-bold mb-3 text-center">
                  {client.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/clients/edit/${client._id}`)
                    }
                    className="flex-1 px-2 py-1 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 transition-colors text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="flex-1 px-2 py-1 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
