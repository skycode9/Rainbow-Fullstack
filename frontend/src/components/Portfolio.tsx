import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  memo,
  Suspense,
  lazy,
} from "react";
import { Play, ExternalLink } from "lucide-react";
import { filmsAPI } from "../services/api";
import { getImageUrl } from "../utils/config";

// Lazy load VideoModal
const VideoModal = lazy(() => import("./VideoModal"));

interface Film {
  _id: string;
  title: string;
  category: string;
  tagline: string;
  thumbnail: string;
  videoUrl: string;
}

function Films() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "0px 0px -100px 0px",
  });
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await filmsAPI.getAll();
        if (response.data && response.data.length > 0) {
          setFilms(response.data);
        }
      } catch (error) {
        console.error("Error fetching films:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const fallbackProjects =
    films.length > 0
      ? films
      : [
          {
            id: 1,
            title: "Ethereal Dreams",
            category: "Music Video",
            description:
              "A visually stunning music video featuring ethereal landscapes and dynamic cinematography.",
            thumbnail:
              "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop",
            videoUrl: "https://www.youtube.com/watch?v=eeJFh3YhPEs",
          },
          {
            id: 2,
            title: "Brand Evolution",
            category: "Commercial",
            description:
              "A compelling brand story showcasing innovation and growth in the tech industry.",
            thumbnail:
              "https://images.unsplash.com/photo-1551818255-e6e10975cd17?w=600&h=400&fit=crop",
            videoUrl: "https://www.youtube.com/watch?v=eeJFh3YhPEs",
          },
          {
            id: 3,
            title: "Ocean Depths",
            category: "Documentary",
            description:
              "An immersive documentary exploring the mysteries of deep ocean ecosystems.",
            thumbnail:
              "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
            videoUrl: "https://www.youtube.com/watch?v=eeJFh3YhPEs",
          },
          {
            id: 4,
            title: "Midnight Runner",
            category: "Short Film",
            description:
              "A noir-inspired short film about redemption and second chances.",
            thumbnail:
              "https://images.unsplash.com/photo-1489599904472-445b83c3fb98?w=600&h=400&fit=crop",
            videoUrl: "https://www.youtube.com/watch?v=eeJFh3YhPEs",
          },
          {
            id: 5,
            title: "Urban Pulse",
            category: "Music Video",
            description:
              "High-energy music video capturing the rhythm and energy of city life.",
            thumbnail:
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
            videoUrl: "https://www.youtube.com/watch?v=eeJFh3YhPEs",
          },
          {
            id: 6,
            title: "Innovation Summit",
            category: "Commercial",
            description:
              "Corporate event coverage showcasing cutting-edge technology and innovation.",
            thumbnail:
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
            videoUrl: "https://www.youtube.com/watch?v=eeJFh3YhPEs",
          },
        ];

  const projects = fallbackProjects;

  return (
    <section id="films" className="py-20 bg-black" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Our</span>{" "}
            <span className="text-white">Films</span>
          </h2>
          <motion.div
            className="relative w-32 h-0.5 mx-auto mb-8 overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
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
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our diverse collection of award-winning films, commercials,
            and creative content that showcase our passion for visual
            storytelling.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          layout
        >
          {loading ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400">Loading films...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400">No films available yet.</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project._id || project.id}
                className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-white transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                layout
              >
                {/* Thumbnail */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(project.thumbnail)}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                    <motion.button
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedVideo(project.videoUrl)}
                    >
                      <Play size={24} fill="currentColor" />
                    </motion.button>
                    {/* <p className="text-white font-semibold text-lg">Watch Now</p> */}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-1">
                    {project.tagline || project.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <motion.button
                      className="text-white font-semibold hover:text-gray-300 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      onClick={() => setSelectedVideo(project.videoUrl)}
                    >
                      Watch Now →
                    </motion.button>
                    <motion.button
                      className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => window.open(project.videoUrl, "_blank")}
                    >
                      <ExternalLink size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* White accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* View All Button */}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <Suspense fallback={null}>
          <VideoModal
            isOpen={!!selectedVideo}
            onClose={() => setSelectedVideo(null)}
            videoUrl={selectedVideo}
          />
        </Suspense>
      )}
    </section>
  );
}

export default memo(Films);
