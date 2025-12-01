import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X, Upload, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { clientsAPI, uploadAPI } from "../../services/api";
import { getImageUrl } from "../../utils/config";

export default function ClientFormNew() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getOne(id!);
      setFormData({
        name: response.data.name,
        logo: response.data.logo,
      });
    } catch (error) {
      console.error("Error fetching client:", error);
      setError("Failed to load client data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.logo) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await clientsAPI.update(id!, formData);
      } else {
        await clientsAPI.create(formData);
      }
      navigate("/admin/clients");
    } catch (err: any) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const response = await uploadAPI.uploadImage(formDataUpload);
      const imageUrl = response.data.url;

      setFormData((prev) => ({ ...prev, logo: imageUrl }));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading client...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/clients")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditMode ? "Edit Client" : "Add Client"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Client Logo <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                      {uploadingImage ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          <span>Choose Logo</span>
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

                {formData.logo && (
                  <div className="mt-3">
                    <div className="flex justify-center">
                      <img
                        src={getImageUrl(formData.logo)}
                        alt="Preview"
                        className="max-h-32 rounded-lg border-2 border-gray-700 bg-white p-4"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/200?text=Invalid+Logo";
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2 text-center">
                      Logo uploaded successfully
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/clients")}
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
