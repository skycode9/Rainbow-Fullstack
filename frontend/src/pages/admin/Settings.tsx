import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Video, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../../utils/config";

const API_URL = getApiUrl();

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/settings/hero_video_url`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHeroVideoUrl(response.data.value || "");
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      if (error.response?.status === 404) {
        setHeroVideoUrl("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API_URL}/settings/hero_video_url`,
        {
          value: heroVideoUrl,
          description: "Hero section background video URL",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Hero video URL updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
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
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Site Settings</h1>
                <p className="text-gray-400 text-sm">
                  Configure hero section and site preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Video Section */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Video size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Hero Video</h2>
                  <p className="text-gray-400 text-sm">
                    Background video for homepage hero section
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Video URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={heroVideoUrl}
                  onChange={(e) => setHeroVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  placeholder="https://example.com/video.mp4"
                  required
                />
                <p className="text-gray-500 text-sm mt-2">
                  Enter the direct URL to your hero video file (MP4, WebM, etc.)
                </p>

                {heroVideoUrl && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Preview URL:</p>
                    <p className="text-sm text-white break-all font-mono">
                      {heroVideoUrl}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
