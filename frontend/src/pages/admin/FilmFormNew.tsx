import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X, Upload, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { filmsAPI, uploadAPI } from "../../services/api";
import { filmSchema, type FilmFormData } from "../../lib/validations";
import { z } from "zod";
import { getImageUrl } from "../../utils/config";

export default function FilmFormNew() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FilmFormData>({
    title: "",
    category: "",
    tagline: "",
    thumbnail: "",
    videoUrl: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchFilm();
    }
  }, [id]);

  const fetchFilm = async () => {
    try {
      setLoading(true);
      const response = await filmsAPI.getOne(id!);
      setFormData({
        title: response.data.title,
        category: response.data.category,
        tagline: response.data.tagline || response.data.description || "",
        thumbnail: response.data.thumbnail,
        videoUrl: response.data.videoUrl,
      });
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
    setErrors({});

    try {
      // Validate with Zod
      filmSchema.parse(formData);

      setLoading(true);
      if (isEditMode) {
        await filmsAPI.update(id!, formData);
      } else {
        await filmsAPI.create(formData);
      }
      navigate("/admin/films");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        setError("Please fix the validation errors");
      } else {
        setError(err.response?.data?.message || "Operation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, thumbnail: "Please select an image file" });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, thumbnail: "Image size must be less than 5MB" });
      return;
    }

    try {
      setUploadingImage(true);
      setErrors({ ...errors, thumbnail: "" });

      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadAPI.uploadImage(formData);
      const imageUrl = response.data.url;

      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
    } catch (err: any) {
      setErrors({
        ...errors,
        thumbnail: err.response?.data?.message || "Failed to upload image",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const wordCount = formData.tagline.trim().split(/\s+/).filter(Boolean).length;

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
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.title ? "border-red-500" : "border-gray-700"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors`}
                  placeholder="Enter film title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.category ? "border-red-500" : "border-gray-700"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors`}
                  placeholder="e.g., Music Video, Commercial, Documentary"
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Tagline <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-sm ml-2">
                    (Max 50 words - {wordCount}/50)
                  </span>
                </label>
                <textarea
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.tagline || wordCount > 50
                      ? "border-red-500"
                      : "border-gray-700"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors resize-none`}
                  placeholder="Enter a brief tagline (max 50 words)"
                />
                {wordCount > 50 && (
                  <p className="text-red-500 text-sm mt-1">
                    Tagline exceeds 50 words limit
                  </p>
                )}
                {errors.tagline && (
                  <p className="text-red-500 text-sm mt-1">{errors.tagline}</p>
                )}
              </div>

              {/* Thumbnail Image */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Thumbnail Image <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.thumbnail ? "border-red-500" : "border-gray-700"
                      } rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center justify-center gap-2`}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          <span>Choose Image</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {errors.thumbnail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.thumbnail}
                  </p>
                )}

                {formData.thumbnail && !errors.thumbnail && (
                  <div className="mt-3">
                    <div className="flex justify-center">
                      <img
                        src={getImageUrl(formData.thumbnail)}
                        alt="Preview"
                        className="max-h-48 rounded-lg border-2 border-gray-700"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=Invalid+Image";
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2 text-center">
                      Image uploaded successfully
                    </p>
                  </div>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Video URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.videoUrl ? "border-red-500" : "border-gray-700"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors`}
                  placeholder="https://youtube.com/watch?v=..."
                />
                {errors.videoUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  YouTube, Vimeo, or direct video URL
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading || wordCount > 50}
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
