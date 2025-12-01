import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { filmsAPI } from "../../services/api";
import { getImageUrl } from "../../utils/config";

export default function FilmForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "Music Video",
    description: "",
    thumbnail: "",
    videoUrl: "",
    featured: false,
    order: 0,
  });

  const categories = [
    "Music Video",
    "Commercial",
    "Documentary",
    "Short Film",
    "Feature Film",
    "Corporate",
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchFilm();
    }
  }, [id]);

  const fetchFilm = async () => {
    try {
      setLoading(true);
      const response = await filmsAPI.getOne(id!);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching film:", error);
      setError("Failed to load film data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEditMode) {
        await filmsAPI.update(id!, formData);
      } else {
        await filmsAPI.create(formData);
      }
      navigate("/admin/films");
    } catch (err: any) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading film data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/films")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditMode ? "Edit Film" : "Add New Film"}
                </h1>
                <p className="text-gray-400 text-sm">
                  {isEditMode
                    ? "Update film information"
                    : "Create a new film entry"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Film Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  placeholder="Enter film title"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors resize-none"
                  placeholder="Enter film description"
                  required
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Thumbnail URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.thumbnail && (
                  <div className="mt-3">
                    <img
                      src={getImageUrl(formData.thumbnail)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Video URL (YouTube) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <p className="text-gray-500 text-sm mt-1">
                  Enter a valid YouTube video URL
                </p>
              </div>

              {/* Order & Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                    min="0"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">
                    Featured Film
                  </label>
                  <div className="flex items-center h-[52px]">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                      <span className="ml-3 text-sm font-medium text-gray-300">
                        {formData.featured ? "Yes" : "No"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Film"
                  : "Create Film"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/films")}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
