import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showcaseAPI } from "../../services/api";
import { getImageUrl } from "../../utils/config";

export default function Showcase() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await showcaseAPI.getAll(true);
      setSlides(response.data);
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      await showcaseAPI.delete(id);
      setSlides(slides.filter((slide) => slide._id !== id));
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Failed to delete slide");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await showcaseAPI.update(id, { isActive: !currentStatus });
      setSlides(
        slides.map((slide) =>
          slide._id === id ? { ...slide, isActive: !currentStatus } : slide
        )
      );
    } catch (error) {
      console.error("Error updating slide:", error);
      alert("Failed to update slide");
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
                  <Image size={24} />
                  Showcase Slider
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage showcase slider images
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/showcase/create")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              <Plus size={20} />
              Add Slide
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-gray-400">Loading slides...</div>
        ) : slides.length === 0 ? (
          <div className="text-center py-12">
            <Image size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-4">No slides found</p>
            <button
              onClick={() => navigate("/admin/showcase/create")}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Add Your First Slide
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, index) => (
              <motion.div
                key={slide._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-gray-900 rounded-xl border ${
                  slide.isActive ? "border-gray-800" : "border-red-800/50"
                } overflow-hidden hover:border-white transition-all duration-300`}
              >
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  {slide.image ? (
                    <img
                      src={getImageUrl(slide.image)}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={48} className="text-gray-600" />
                    </div>
                  )}
                  {!slide.isActive && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-red-400 font-semibold">
                        Inactive
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                    Order: {slide.order || 0}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(slide._id, slide.isActive)}
                      className={`flex-1 px-3 py-2 ${
                        slide.isActive
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                          : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                      } rounded-lg transition-colors font-semibold flex items-center justify-center gap-2`}
                    >
                      {slide.isActive ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                      {slide.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/showcase/edit/${slide._id}`)
                      }
                      className="px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
                      className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={16} />
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
