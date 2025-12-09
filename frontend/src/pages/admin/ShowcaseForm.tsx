import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X, Upload, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { showcaseAPI, uploadAPI } from "../../services/api";
import { showcaseSchema, type ShowcaseFormData } from "../../lib/validations";
import { z } from "zod";
import { getImageUrl } from "../../utils/config";

export default function ShowcaseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ShowcaseFormData>({
    title: "",
    subtitle: "",
    image: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (isEditMode) {
      fetchSlide();
    }
  }, [id]);

  const fetchSlide = async () => {
    try {
      setLoading(true);
      const response = await showcaseAPI.getOne(id!);
      setFormData({
        title: response.data.title,
        subtitle: response.data.subtitle || "",
        image: response.data.image,
        order: response.data.order || 0,
        isActive: response.data.isActive,
      });
    } catch (error) {
      console.error("Error fetching slide:", error);
      setError("Failed to load slide data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    try {
      showcaseSchema.parse(formData);

      setLoading(true);
      if (isEditMode) {
        await showcaseAPI.update(id!, formData);
      } else {
        await showcaseAPI.create(formData);
      }
      navigate("/admin/showcase");
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
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === "order") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Please select an image file" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image size must be less than 10MB" });
      return;
    }

    try {
      setUploadingImage(true);
      setErrors({ ...errors, image: "" });

      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const response = await uploadAPI.uploadImage(uploadFormData);
      const imageUrl = response.data.url;

      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (err: any) {
      setErrors({
        ...errors,
        image: err.response?.data?.message || "Failed to upload image",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading slide data...</p>
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
                onClick={() => navigate("/admin/showcase")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditMode ? "Edit Slide" : "Add New Slide"}
                </h1>
                <p className="text-gray-400 text-sm">
                  {isEditMode
                    ? "Update slide information"
                    : "Create a new showcase slide"}
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
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.title ? "border-red-500" : "border-gray-700"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors`}
                  placeholder="e.g., THE JOURNEY"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.subtitle ? "border-red-500" : "border-gray-700"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors`}
                  placeholder="e.g., Behind every great film is an incredible story"
                />
                {errors.subtitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Background Image <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.image ? "border-red-500" : "border-gray-700"
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

                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}

                {formData.image && !errors.image && (
                  <div className="mt-3">
                    <div className="flex justify-center">
                      <img
                        src={getImageUrl(formData.image)}
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

              {/* Order */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  placeholder="0"
                  min="0"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Lower numbers appear first
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-white focus:ring-white"
                />
                <label
                  htmlFor="isActive"
                  className="text-gray-300 font-semibold"
                >
                  Active (visible on website)
                </label>
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
                  ? "Update Slide"
                  : "Create Slide"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/showcase")}
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
