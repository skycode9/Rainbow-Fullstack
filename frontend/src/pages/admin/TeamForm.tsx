import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { teamAPI } from "../../services/api";
import { getImageUrl } from "../../utils/config";

export default function TeamForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    tagline: "",
    image: "",
    accentColor: "from-gray-400 to-gray-600",
    order: 0,
    active: true,
  });

  const accentColors = [
    { name: "Gray", value: "from-gray-400 to-gray-600" },
    { name: "Slate", value: "from-slate-400 to-slate-600" },
    { name: "Zinc", value: "from-zinc-400 to-zinc-600" },
    { name: "Neutral", value: "from-neutral-400 to-neutral-600" },
    { name: "Stone", value: "from-stone-400 to-stone-600" },
    { name: "Blue", value: "from-blue-400 to-blue-600" },
    { name: "Purple", value: "from-purple-400 to-purple-600" },
    { name: "Pink", value: "from-pink-400 to-pink-600" },
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchTeamMember();
    }
  }, [id]);

  const fetchTeamMember = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getOne(id!);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching team member:", error);
      setError("Failed to load team member data");
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
        await teamAPI.update(id!, formData);
      } else {
        await teamAPI.create(formData);
      }
      navigate("/admin/team");
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
          <p className="text-gray-400">Loading team member data...</p>
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
                onClick={() => navigate("/admin/team")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditMode ? "Edit Team Member" : "Add New Team Member"}
                </h1>
                <p className="text-gray-400 text-sm">
                  {isEditMode
                    ? "Update team member information"
                    : "Create a new team member entry"}
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
              {/* Name */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Role/Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  placeholder="e.g., Creative Director, Cinematographer"
                  required
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Tagline
                </label>
                <textarea
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors resize-none"
                  placeholder="Short tagline or bio"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Profile Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.image && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={getImageUrl(formData.image)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border-2 border-gray-700"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/150?text=Invalid+Image";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Accent Color
                </label>
                <select
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                >
                  {accentColors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`h-8 w-32 rounded bg-gradient-to-r ${formData.accentColor}`}
                  ></div>
                  <span className="text-sm text-gray-400">Preview</span>
                </div>
              </div>

              {/* Order & Active */}
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
                    Active Status
                  </label>
                  <div className="flex items-center h-[52px]">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                      <span className="ml-3 text-sm font-medium text-gray-300">
                        {formData.active ? "Active" : "Inactive"}
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
                  ? "Update Member"
                  : "Create Member"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/team")}
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
