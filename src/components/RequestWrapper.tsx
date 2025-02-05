import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Share2, Plus, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    path: "/status",
    label: "Status",
    icon: Clock,
  },
  {
    path: "/share",
    label: "Share",
    icon: Share2,
  },
  {
    path: "/preview",
    label: "Preview",
    icon: Eye,
  },
];

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const { pathname } = useLocation();
  const currentPath = `/${pathname.split("/")[1]}`;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={false}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      ref={ref}
    >
      <div className="relative">
        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full",
            "bg-white shadow-lg border border-rose-200",
            "flex items-center justify-center",
            "hover:bg-rose-50 transition-all duration-200",
            "absolute bottom-0 right-0 z-10",
            "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          )}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle navigation"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-6 h-6 text-rose-500" />
          </motion.div>
        </motion.button>

        {/* Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute bottom-16 right-0",
                "bg-white rounded-2xl shadow-xl border border-rose-100",
                "p-3 min-w-[200px]"
              )}
            >
              <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = currentPath === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      to={`${item.path}/${id}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl",
                        "transition-all duration-200",
                        "hover:bg-rose-50",
                        isActive && "bg-rose-100 text-rose-600",
                        "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function RequestWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {children}
      <FloatingNav />
    </div>
  );
}
