import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Film,
  Users,
  Building2,
  Mail,
  LogOut,
  Bell,
  Video,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  filmsAPI,
  teamAPI,
  clientsAPI,
  contactAPI,
  subscribersAPI,
} from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    films: 0,
    team: 0,
    clients: 0,
    contacts: 0,
    subscribers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("adminData");
    if (data) {
      setAdminData(JSON.parse(data));
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [filmsRes, teamRes, clientsRes, contactsRes, subscribersRes] =
        await Promise.all([
          filmsAPI.getAll(),
          teamAPI.getAll(),
          clientsAPI.getAll(),
          contactAPI.getAll(),
          subscribersAPI.getAll(),
        ]);

      setStats({
        films: filmsRes.data.length,
        team: teamRes.data.length,
        clients: clientsRes.data.length,
        contacts: contactsRes.data.length,
        subscribers: subscribersRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const statCards = [
    {
      title: "Films",
      count: stats.films,
      icon: Film,
      color: "from-blue-500 to-blue-600",
      link: "/admin/films",
    },
    {
      title: "Team Members",
      count: stats.team,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      link: "/admin/team",
    },
    {
      title: "Clients",
      count: stats.clients,
      icon: Building2,
      color: "from-pink-500 to-pink-600",
      link: "/admin/clients",
    },
    {
      title: "Messages",
      count: stats.contacts,
      icon: Mail,
      color: "from-green-500 to-green-600",
      link: "/admin/contacts",
    },
    {
      title: "Subscribers",
      count: stats.subscribers,
      icon: Bell,
      color: "from-orange-500 to-orange-600",
      link: "/admin/subscribers",
    },
    {
      title: "Hero Video",
      count: "⚙️",
      icon: Video,
      color: "from-red-500 to-red-600",
      link: "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-white">Rainbow</span>{" "}
                <span className="bg-rainbow-gradient bg-clip-text text-transparent">
                  Films
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-semibold">{adminData?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors duration-300"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => navigate(stat.link)}
                className="cursor-pointer"
              >
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-white transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon size={24} />
                    </div>
                    <span className="text-3xl font-bold">{stat.count}</span>
                  </div>
                  <h3 className="text-gray-400 font-semibold">{stat.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/admin/films")}
                className="px-4 py-3 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors duration-300 font-semibold"
              >
                Manage Films
              </button>
              <button
                onClick={() => navigate("/admin/team")}
                className="px-4 py-3 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 transition-colors duration-300 font-semibold"
              >
                Manage Team
              </button>
              <button
                onClick={() => navigate("/admin/clients")}
                className="px-4 py-3 bg-pink-500/10 text-pink-500 rounded-lg hover:bg-pink-500/20 transition-colors duration-300 font-semibold"
              >
                Manage Clients
              </button>
              <button
                onClick={() => navigate("/admin/contacts")}
                className="px-4 py-3 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors duration-300 font-semibold"
              >
                View Messages
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
