import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Trash2, ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { subscribersAPI } from "../../services/api";

interface Subscriber {
  _id: string;
  email: string;
  active: boolean;
  subscribedAt: string;
}

export default function Subscribers() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    fetchSubscribers();
    // Check for new subscribers every 30 seconds
    const interval = setInterval(checkNewSubscribers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await subscribersAPI.getAll();
      setSubscribers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      setLoading(false);
    }
  };

  const checkNewSubscribers = async () => {
    try {
      const response = await subscribersAPI.getAll();
      const currentCount = subscribers.length;
      const newDataCount = response.data.length;
      if (newDataCount > currentCount) {
        setNewCount(newDataCount - currentCount);
        setSubscribers(response.data);
      }
    } catch (error) {
      console.error("Error checking new subscribers:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) {
      return;
    }

    try {
      await subscribersAPI.delete(id);
      setSubscribers(subscribers.filter((sub) => sub._id !== id));
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("Failed to delete subscriber");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <Mail size={24} />
                <div>
                  <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
                  <p className="text-gray-400 text-sm">
                    {subscribers.length} total subscribers
                  </p>
                </div>
              </div>
            </div>

            {newCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg"
              >
                <Bell size={18} className="text-green-500" />
                <span className="text-green-500 font-semibold">
                  {newCount} New Subscriber{newCount > 1 ? "s" : ""}!
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Inbox Layout */}
      <div className="container mx-auto px-6 py-6">
        {subscribers.length === 0 ? (
          <div className="text-center py-20">
            <Mail size={64} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No Subscribers Yet</h3>
            <p className="text-gray-400">
              Subscribers will appear here when they sign up
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {/* Inbox Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-800 border-b border-gray-700 text-sm font-semibold text-gray-400">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Email Address</div>
              <div className="col-span-3">Subscribed On</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Inbox Items */}
            <div className="divide-y divide-gray-800">
              {subscribers.map((subscriber, index) => {
                const isNew =
                  new Date(subscriber.subscribedAt).getTime() >
                  Date.now() - 24 * 60 * 60 * 1000;

                return (
                  <motion.div
                    key={subscriber._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-800/50 transition-colors ${
                      isNew ? "bg-green-500/5" : ""
                    }`}
                  >
                    <div className="col-span-1 flex items-center text-gray-500">
                      {index + 1}
                    </div>

                    <div className="col-span-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                        {subscriber.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{subscriber.email}</p>
                        {isNew && (
                          <span className="text-xs text-green-500 font-semibold">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center text-gray-400 text-sm">
                      {formatDate(subscriber.subscribedAt)}
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(subscriber._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
