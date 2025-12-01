import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Film, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { filmsAPI } from "../../services/api";
import { getImageUrl } from "../../utils/config";

export default function Films() {
  const navigate = useNavigate();
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await filmsAPI.getAll();
      setFilms(response.data);
    } catch (error) {
      console.error("Error fetching films:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this film?")) return;

    try {
      await filmsAPI.delete(id);
      setFilms(films.filter((film) => film._id !== id));
    } catch (error) {
      console.error("Error deleting film:", error);
      alert("Failed to delete film");
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
                  <Film size={24} />
                  Films Management
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage your film portfolio
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/films/create")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              <Plus size={20} />
              Add Film
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-gray-400">Loading films...</div>
        ) : films.length === 0 ? (
          <div className="text-center py-12">
            <Film size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-4">No films found</p>
            <button
              onClick={() => navigate("/admin/films/create")}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Add Your First Film
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {films.map((film, index) => (
              <motion.div
                key={film._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-white transition-all duration-300"
              >
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  {film.thumbnail ? (
                    <img
                      src={getImageUrl(film.thumbnail)}
                      alt={film.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film size={48} className="text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{film.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {film.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/films/edit/${film._id}`)}
                      className="flex-1 px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(film._id)}
                      className="flex-1 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
