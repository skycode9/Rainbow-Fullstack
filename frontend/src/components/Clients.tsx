import { motion } from "framer-motion";
import { memo, useState, useEffect } from "react";
import { clientsAPI } from "../services/api";
import { getImageUrl } from "../utils/config";

interface Client {
  _id: string;
  name: string;
  logo: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackClients = [
    "Netflix",
    "Amazon Prime",
    "Disney+",
    "HBO Max",
    "Sony Pictures",
    "Warner Bros",
    "Universal",
    "Paramount",
  ];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await clientsAPI.getAll();
        console.log("Clients API Response:", response.data);
        if (response.data && response.data.length > 0) {
          setClients(response.data);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const displayClients =
    clients.length > 0
      ? clients
      : fallbackClients.map((name, i) => ({
          _id: `fallback-${i}`,
          name,
          logo: "",
        }));

  return (
    <section className="py-20 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <motion.div
            className="relative w-64 h-0.5 mx-auto mb-6 overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              maskImage:
                "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          >
            <div className="absolute inset-0 bg-rainbow-gradient" />
          </motion.div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We've had the privilege to work with some of the biggest names in
            the entertainment industry
          </p>
        </div>

        {/* Infinite Scrolling Slider */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Loading clients...</p>
          </div>
        ) : (
          <div className="relative overflow-hidden py-8">
            {/* Gradient fade overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div className="flex clients-scroll space-x-16 items-center">
              {/* First set */}
              {displayClients.map((client, index) =>
                client.logo ? (
                  <motion.img
                    key={`first-${client._id || index}`}
                    src={getImageUrl(client.logo)}
                    alt={client.name}
                    className="h-24 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                    whileHover={{ scale: 1.15 }}
                    loading="lazy"
                  />
                ) : null
              )}

              {/* Second set for seamless loop */}
              {displayClients.map((client, index) =>
                client.logo ? (
                  <motion.img
                    key={`second-${client._id || index}`}
                    src={getImageUrl(client.logo)}
                    alt={client.name}
                    className="h-16 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                    whileHover={{ scale: 1.15 }}
                    loading="lazy"
                  />
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(Clients);
